export const countryList = [
  {
    value: "ad",
    label: {
      en: "Andorra",
      zh: "安道爾"
    }
  },
  {
    value: "al",
    label: {
      en: "Albania",
      zh: "阿爾巴尼亞"
    }
  },
  {
    value: "at",
    label: {
      en: "Austria",
      zh: "奧地利"
    }
  },
  {
    value: "ba",
    label: {
      en: "Bosnia and Herzegovina",
      zh: "波士尼亞與赫塞哥維納"
    }
  },
  {
    value: "be",
    label: {
      en: "Belgium",
      zh: "比利時"
    }
  },
  {
    value: "bg",
    label: {
      en: "Bulgaria",
      zh: "保加利亞"
    }
  },
  {
    value: "by",
    label: {
      en: "Belarus",
      zh: "白俄羅斯"
    }
  },
  {
    value: "ch",
    label: {
      en: "Switzerland",
      zh: "瑞士"
    }
  },
  {
    value: "cy",
    label: {
      en: "Cyprus",
      zh: "賽普勒斯"
    }
  },
  {
    value: "cz",
    label: {
      en: "Czech Republic",
      zh: "捷克"
    }
  },
  {
    value: "de",
    label: {
      en: "Germany",
      zh: "德國"
    }
  },
  {
    value: "dk",
    label: {
      en: "Denmark",
      zh: "丹麥"
    }
  },
  {
    value: "ee",
    label: {
      en: "Estonia",
      zh: "愛沙尼亞"
    }
  },
  {
    value: "es",
    label: {
      en: "Spain",
      zh: "西班牙"
    }
  },
  {
    value: "fi",
    label: {
      en: "Finland",
      zh: "芬蘭"
    }
  },
  {
    value: "fr",
    label: {
      en: "France",
      zh: "法國"
    }
  },
  {
    value: "gb",
    label: {
      en: "United Kingdom",
      zh: "英國"
    }
  },
  {
    value: "gr",
    label: {
      en: "Greece",
      zh: "希臘"
    }
  },
  {
    value: "hr",
    label: {
      en: "Croatia",
      zh: "克羅埃西亞"
    }
  },
  {
    value: "hu",
    label: {
      en: "Hungary",
      zh: "匈牙利"
    }
  },
  {
    value: "ie",
    label: {
      en: "Ireland",
      zh: "愛爾蘭"
    }
  },
  {
    value: "is",
    label: {
      en: "Iceland",
      zh: "冰島"
    }
  },
  {
    value: "it",
    label: {
      en: "Italy",
      zh: "義大利"
    }
  },
  {
    value: "li",
    label: {
      en: "Liechtenstein",
      zh: "列支敦斯登"
    }
  },
  {
    value: "lt",
    label: {
      en: "Lithuania",
      zh: "立陶宛"
    }
  },
  {
    value: "lu",
    label: {
      en: "Luxembourg",
      zh: "盧森堡"
    }
  },
  {
    value: "lv",
    label: {
      en: "Latvia",
      zh: "拉脫維亞"
    }
  },
  {
    value: "mc",
    label: {
      en: "Monaco",
      zh: "摩納哥"
    }
  },
  {
    value: "md",
    label: {
      en: "Moldova",
      zh: "摩爾多瓦"
    }
  },
  {
    value: "me",
    label: {
      en: "Montenegro",
      zh: "蒙特內哥羅"
    }
  },
  {
    value: "mk",
    label: {
      en: "North Macedonia",
      zh: "北馬其頓"
    }
  },
  {
    value: "mt",
    label: {
      en: "Malta",
      zh: "馬爾他"
    }
  },
  {
    value: "nl",
    label: {
      en: "Netherlands",
      zh: "荷蘭"
    }
  },
  {
    value: "no",
    label: {
      en: "Norway",
      zh: "挪威"
    }
  },
  {
    value: "pl",
    label: {
      en: "Poland",
      zh: "波蘭"
    }
  },
  {
    value: "pt",
    label: {
      en: "Portugal",
      zh: "葡萄牙"
    }
  },
  {
    value: "ro",
    label: {
      en: "Romania",
      zh: "羅馬尼亞"
    }
  },
  {
    value: "rs",
    label: {
      en: "Serbia",
      zh: "塞爾維亞"
    }
  },
  {
    value: "ru",
    label: {
      en: "Russia",
      zh: "俄羅斯"
    }
  },
  {
    value: "se",
    label: {
      en: "Sweden",
      zh: "瑞典"
    }
  },
  {
    value: "si",
    label: {
      en: "Slovenia",
      zh: "斯洛維尼亞"
    }
  },
  {
    value: "sk",
    label: {
      en: "Slovakia",
      zh: "斯洛伐克"
    }
  },
  {
    value: "sm",
    label: {
      en: "San Marino",
      zh: "聖馬利諾"
    }
  },
  {
    value: "ua",
    label: {
      en: "Ukraine",
      zh: "烏克蘭"
    }
  },
  {
    value: "va",
    label: {
      en: "Vatican City",
      zh: "梵蒂岡"
    }
  },
  {
    value: "us",
    label: {
      en: "United States",
      zh: "美國"
    }
  },
  {
    value: "cn",
    label: {
      en: "China",
      zh: "中國"
    }
  },
] as const;

export type Country = (typeof countryList)[number]["value"];
