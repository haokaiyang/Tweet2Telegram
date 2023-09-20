require('dotenv').config()
const consola = require('consola')
const request = require('request')
const URL = require('url')

const constructTweetLink = (id, username) => {
    return `https://twitter.com/${username}/status/${id}`
}

const constructProfileLink = (username) => {
    return `https://twitter.com/${username}`
}

const convertMediaToTelegram = (ctx) => {
    if (ctx && ctx.media && ctx.media.length !== 0) {
        return ctx.media.map(e => {
            if (e.type === 'video' || e.type === 'animated_gif') {
                const supportedMaxRate = e.video_info.variants.reduce((next, current) => {
                    if (next.context_type !== 'video/mp4') {
                        return current
                    } 
                    if (next.bitrate) {
                        if (current && current.bitrate) {
                            return next.bitrate > current.bitrate ? next : current
                        }
                        return next
                    }
                    return current
                })
                return {
                    type: 'video',
                    media: supportedMaxRate.url
                }
            }

            return {
                media: `${e.media_url_https}?name=large`,
                type: e.type
            }
        })
    }
    return []
}

const revertLinks = (formatted, originalLinks) => {
    originalLinks.forEach(e => {
        formatted = formatted.replace(e.url, e.expanded_url)
    })

    // Remove all extra link
    const twitterLinkRegex = /https:\/\/t\.co\/[a-zA-Z0-9]{10}/g
    const links = formatted.match(twitterLinkRegex) || []
    links.forEach(e => {
        formatted = formatted.replace(e, '')
    })
    
    return formatted
}

const replaceMentionedUser = (formatted, listOfMentions) => {
    listOfMentions.forEach(e => {
        formatted = formatted.replace(`@${e.screen_name}`, `<a href="${constructProfileLink(e.screen_name)}">@${e.screen_name}</a>`)
    })

    return formatted
}

const formatText = (str, tweet) => {
    let formatted = str
    formatted = revertLinks(formatted, tweet.entities.urls)
    formatted = replaceMentionedUser(formatted, tweet.entities.user_mentions)

    return formatted
}
const twitterClient = (url) => {
    return new Promise(function(resolve, reject) {
        var options = {
              'method': 'GET',
              'url': url,
              'headers': {
                'authority': 'api.twitter.com',
                'cookie': process.env.TWITTER_COOKIE,
                'x-csrf-token' : process.env.TWITTER_X_CSRF_TOKEN,
                'accept': '*/*',
                'x-twitter-auth-type': 'OAuth2Session',
                'accept-language': 'zh-CN,zh-Hans;q=0.9',
                'user-agent': 'CFNetwork/1408.0.4 Darwin/26.2.0',
                'authorization': process.env.TWITTER_AUTHORIZATION,
                'accept-encoding': 'gzip'
              },
              gzip : true,
              json : true
            };
            consola.info(options)
            request(options, function (error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response.body);
                }
            });
        });
}

const twitterFavoritesList = async ()=> {
    url = URL.format({
          protocol: 'https',
          host: 'api.twitter.com',
          pathname: '/1.1/favorites/list.json',
          query: {
              tweet_mode:'extended',
              count: 200
          }
      });
    return await twitterClient(url)
}

const getAllLikesSince = async () => {
    const content = await twitterFavoritesList()
    return content.map(e => {
        return {
            id: e.id_str,
            link: constructTweetLink(e.id_str, e.user.screen_name),
            media: convertMediaToTelegram(e.extended_entities),
            user: {
                username: e.user.screen_name,
                link: constructProfileLink(e.user.screen_name)
            },
            text: formatText(e.full_text, e),
            nsfw: e.possibly_sensitive
        }
    })
}

module.exports = {
    getAllLikesSince
}