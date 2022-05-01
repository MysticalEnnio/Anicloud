import fetch from "sync-fetch";
import cheerio from "cheerio";
import cliProgress from "cli-progress";
import fs from "fs";
import asnyc from "async";

function getEpisodeIds(href) {
  let fetchData = fetch(href).text();
  const $ = cheerio.load(fetchData);

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
}

function setEpisodeSeen(id) {
  return fetch("https://anicloud.io/ajax/lastseen", {
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
        "https://anicloud.io/anime/stream/no-game-no-life/staffel-1/episode-1",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: "episode=" + id,
    method: "POST",
  }).json();
}

function getAllAnimeSeasons(href) {
  let fetchData = fetch(href).text();
  const $ = cheerio.load(fetchData);

  let seasonContainer = $(".hosterSiteDirectNav")
    .children()
    .first()
    .children()
    .slice(1);

  let seasons = [];

  seasonContainer.each(function () {
    seasons.push(
      "https://anicloud.io" + $(this).children().first().attr("href")
    );
  });

  fs.writeFileSync("json/seasons.json", JSON.stringify(seasons));

  return seasons;
}

function getAllAnimes() {
  const allAnimeHref = "https://anicloud.io/animes";

  let fetchData = fetch(allAnimeHref).text();
  const $ = cheerio.load(fetchData);

  let genresContainer = $("#seriesContainer");
  let episodeHrefs = [];
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

  return episodeHrefs;
}

const allAnime = JSON.parse(
  fs.readFileSync("./json/episodeHrefs.json", "utf8")
);

let allAnimeSeasons = [];

const getAllAnimeSeasonsProgress = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
);

getAllAnimeSeasonsProgress.start(allAnime.length, 0);

allAnime.forEach((e, i) => {
  allAnimeSeasons = allAnimeSeasons.concat(getAllAnimeSeasons(e));
  getAllAnimeSeasonsProgress.update(i);
});

fs.writeFileSync("json/episodeHrefs.json", JSON.stringify(allAnimeSeasons));

getAllAnimeSeasonsProgress.stop();

let allEpisodeIds = [];

const getAllEpisodeIdsProgress = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
);

getAllEpisodeIdsProgress.start(allAnimeSeasons.length, 0);

allAnimeSeasons.forEach((e, i) => {
  allEpisodeIds = allEpisodeIds.concat(getEpisodeIds(e));
  getAllEpisodeIdsProgress.update(i);
});
getAllEpisodeIdsProgress.stop();
fs.writeFileSync("json/episodeIds.json", JSON.stringify(episodeIds));

/*const seeAllEpisodeIdsProgress = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
);

seeAllEpisodeIdsProgress.start(allEpisodeIds.length, 0);

allEpisodeIds.forEach((e, i) => {
  if (setEpisodeSeen(e)) {
    seeAllEpisodeIdsProgress.update(i);
  }
});

seeAllEpisodeIdsProgress.stop();*/
