import fetch from "node-fetch";
import cheerio from "cheerio";

let animeToFetch = "https://anicloud.io/anime/stream/hunter-x-hunter/staffel-2";

function getEpisodeIds(href) {
  return fetch(href)
    .then((response) => response.text())
    .then((data) => {
      const $ = cheerio.load(data);

      let episodeListDOM = $(".hosterSiteDirectNav")
        .children("ul")
        .eq(1)
        .children()
        .slice(1);
      let episodeIds = [];

      episodeListDOM.each(function () {
        episodeIds.push($(this).children().first().attr("data-episode-id"));
      });
      return episodeIds;
    });
}

function setEpisodeSeen(id) {
  fetch("https://anicloud.io/ajax/lastseen", {
    headers: {
      accept: "*/*",
      "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="98", "Opera GX";v="84"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      cookie:
        "__ddg1=IBRP71KbFqeuMdVsAEmH; anicloud_session=67fvk5visfl3lmk0eo6h773aef; SLG_G_WPT_TO=de; SLG_GWPT_Show_Hide_tmp=1; _ym_d=1645711985; _ym_uid=1645711985293007302; rememberLogin=yo4uuAZIvAO7E0nw85o0SJXDvyD4GlzgedBgnW9FQUUolIQC6UJa5kKiyAHolK540ZaToWmdF2NmAYKUfrdCrUMPf4W6ztjzodvubmhwRw2iR7O31pJ1H1u4; SLG_wptGlobTipTmp=1; __ddg1_=kqFl7XgLRhReX7DW7SCb; _ym_isad=2",
      Referer:
        "https://anicloud.io/anime/stream/fantasia-sango-realm-of-legends/staffel-1/episode-1",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: "episode=" + id,
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

function getAllAnimes() {
  const allAnimeHref = "https://anicloud.io/animes";

  return fetch(allAnimeHref)
    .then((response) => response.text())
    .then((data) => {
      const $ = cheerio.load(data);

      let genresContainer = $("#seriesContainer");
      let episodeHrefs = [];
      genresContainer
        .children()
        .first()
        .children("ul")
        .first()
        .children()
        .each(function () {
          episodeHrefs.push(
            "https://anicloud.io" +
              $(this).children().first().attr("href") +
              "/staffel-1"
          );
        });
      /*
      genresContainer.children().each(function () {
        $(this)
          .children("ul")
          .first()
          .children()
          .each(function () {
            episodeHrefs.push(
              "https://anicloud.io" +
                $(this).children().first().attr("href") +
                "/staffel-1"
            );
          });
      });
      */
      return episodeHrefs;
    });
}

let allEpisodeIds = [];

let allAnimeHrefs = await getAllAnimes();

let episodeIds = ["12345"];

async function getAllEpisodeIds() {
  allAnimeHrefs.forEach(async (e) => {
    episodeIds = await getEpisodeIds(e);
    allEpisodeIds = allEpisodeIds.concat(episodeIds);
  });
}

await getAllEpisodeIds();

console.log(allEpisodeIds);

allEpisodeIds.forEach((e) => {
  setEpisodeSeen(e);
});
