// The Inner Grail — latest dictations feed (proxies the ascendedmasterlight.com RSS).
module.exports = async (req, res) => {
  try {
    const r = await fetch("https://ascendedmasterlight.com/feed/", { headers: { "user-agent": "InnerGrail/1.0" } });
    const xml = await r.text();
    const items = [];
    const re = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = re.exec(xml)) && items.length < 10) {
      const blk = m[1];
      const t = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/.exec(blk);
      const l = /<link>([\s\S]*?)<\/link>/.exec(blk);
      const d = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(blk);
      if (t && l) items.push({ title: t[1].trim(), link: l[1].trim(), date: d ? d[1].trim().slice(0, 16) : "" });
    }
    res.status(200).json({ items });
  } catch (e) {
    res.status(200).json({ items: [], error: e.message });
  }
};
