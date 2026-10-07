<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap - ModraDown</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #334155;
            background-color: #0b0f24;
            color: #f8fafc;
            margin: 0;
            padding: 30px;
          }
          .container {
            max-width: 1080px;
            margin: 0 auto;
            background: #111836;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          }
          h1 {
            color: #ffffff;
            font-size: 24px;
            margin: 0 0 8px 0;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .badge {
            background: linear-gradient(135deg, #6650ff, #d946ef);
            color: #fff;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
          }
          p.desc {
            color: #94a3b8;
            font-size: 14px;
            margin-top: 0;
            margin-bottom: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th {
            background-color: rgba(255,255,255,0.04);
            color: #cbd5e1;
            text-align: left;
            padding: 12px 14px;
            font-weight: 600;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            color: #e2e8f0;
          }
          tr:hover td {
            background-color: rgba(102, 80, 255, 0.08);
          }
          a {
            color: #a78bfa;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            color: #c084fc;
            text-decoration: underline;
          }
          .priority {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            background: rgba(102, 80, 255, 0.2);
            color: #c4b5fd;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>
            <span>ModraDown XML Sitemap</span>
            <span class="badge">Google Verified</span>
          </h1>
          <p class="desc">
            This XML Sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> indexed URLs for <strong>https://modradown.com/</strong>.
          </p>
          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL</th>
                <th style="width: 15%;">Priority</th>
                <th style="width: 15%;">Change Frequency</th>
                <th style="width: 15%;">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a target="_blank">
                      <xsl:attribute name="href">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:attribute>
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="priority"><xsl:value-of select="sitemap:priority"/></span>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
