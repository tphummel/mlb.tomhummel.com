---
title: "Retrosheet Data Guide"
date: 2022-09-25T12:04:00-07:00
tags: ["data"]
toc: true
draft: true
---

<!--more-->

# Intro


```
brew update
brew install chadwick

which cwevent
which cwgame

cd content/blog/retrosheet-data-guide/workbench
mkdir db
git clone https://github.com/thesiddfinch/retrosheet.git
cd retrosheet
chmod u+x load-sql.sh
./load-sql.sh

sqlite3 db/retrosheet.db
.separator ,
.import $file $table

```

# Appendix

- [A nice article][4] about using chadwick on mac/linux. With [code samples][3]. 


  [0]: https://retrosheet.org/
  [1]: https://www.retrosheet.org/tools.htm
  [2]: https://github.com/chadwickbureau/chadwick
  [3]: https://github.com/thesiddfinch/retrosheet
  [4]: https://www.pitcherlist.com/retrosheet-play-by-play-data-at-your-fingertips/
