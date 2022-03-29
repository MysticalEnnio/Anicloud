# Anicloud utils

### Structure of a episode site

Every episode has its own unique id(data-episode-id) found in:

1. In the second "<ul>" in the div with the class "hosterSiteDirectNav" (The numbers to navigate between episodes)
2. In the div with the class "hosterSiteTitle"

## Api

### Api calls

##### https://anicloud.io/ajax/checkLiveNotifications

fetch("https://anicloud.io/ajax/checkLiveNotifications", {
"headers": {
"accept": "_/_",
"accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Opera GX\";v=\"84\"",
"sec-ch-ua-mobile": "?0",
"sec-ch-ua-platform": "\"Windows\"",
"sec-fetch-dest": "empty",
"sec-fetch-mode": "cors",
"sec-fetch-site": "same-origin",
"x-requested-with": "XMLHttpRequest",
"cookie": "**ddg1=IBRP71KbFqeuMdVsAEmH; anicloud_session=67fvk5visfl3lmk0eo6h773aef; SLG_G_WPT_TO=de; SLG_GWPT_Show_Hide_tmp=1; \_ym_d=1645711985; \_ym_uid=1645711985293007302; rememberLogin=yo4uuAZIvAO7E0nw85o0SJXDvyD4GlzgedBgnW9FQUUolIQC6UJa5kKiyAHolK540ZaToWmdF2NmAYKUfrdCrUMPf4W6ztjzodvubmhwRw2iR7O31pJ1H1u4; SLG_wptGlobTipTmp=1; **ddg1\_=kqFl7XgLRhReX7DW7SCb; \_ym_isad=2",
"Referer": "https://anicloud.io/anime/stream/fantasia-sango-realm-of-legends/staffel-1/episode-1",
"Referrer-Policy": "strict-origin-when-cross-origin"
},
"body": "live=true",
"method": "POST"
});

#####
