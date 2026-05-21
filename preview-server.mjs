import http from "node:http";
import { URL } from "node:url";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const googleSiteVerification = "MRsseZ7mXQZr6JRX6unP_hxWAE3Qfi-qPVenJ3p8O0g";

const nav = [
  ["/about", "資料室について"],
  ["/issues", "既刊一覧"],
  ["/updates", "更新履歴"],
  ["/members", "部員記録"],
  ["/search", "資料室内検索"]
];

const people = {
  "asakura-jin": { name: "朝倉仁", no: "01", role: "発行責任者", period: "2012年春〜2013年春" },
  "ono-mizuki": { name: "小野瑞希", no: "02", role: "編集責任者", period: "2012年春〜2013年秋" },
  "miyazawa-akari": { name: "宮沢灯", no: "03", role: "発行責任者", period: "2012年春〜2014年秋" },
  "hirai-naoto": { name: "平井直人", no: "04", role: "部員", period: "2012年春〜2014年春" },
  "sugihara-mei": { name: "杉原芽衣", no: "05", role: "発行責任者・編集責任者", period: "2013年秋〜2015年春" },
  "kawase-wataru": { name: "川瀬航", no: "06", role: "部員", period: "2014年春〜2015年春" },
  "minamino-taku": { name: "南野拓", no: "07", role: "発行責任者・編集責任者", period: "2014年秋〜2016年春" },
  "fujino-kei": { name: "藤野圭", no: "08", role: "発行責任者", period: "2015年春〜2018年春" },
  "hasegawa-rina": { name: "長谷川莉奈", no: "09", period: "2015年秋〜2017年秋" },
  "seo-chihiro": { name: "瀬尾千尋", no: "10", period: "2015年秋〜2018年秋" },
  "kudo-mayu": { name: "工藤真由", no: "11", period: "2016年春〜2018年春" },
  "miyahara-aoi": { name: "宮原葵", no: "12", period: "2017年春〜2019年春" },
  "ishida-wataru": { name: "石田航", no: "13", period: "2017年春〜2019年春" },
  "saeki-ryo": { name: "佐伯亮", no: "01", period: "2018年春〜2022年春", role: "発行責任者", post: ["2023年　文芸誌新人賞を受賞", "2024年　単行本デビュー", "2025年　短篇集が複数紙で紹介される"], note: "卒業後の活動については、公開情報をもとに最小限の記録のみ掲載しています。" },
  "kitamura-kaho": { name: "北村夏帆", no: "02", period: "2018年春〜2022年春", role: "編集責任者" },
  "mihashi-mio": { name: "三橋澪", no: "03", period: "2019年春〜2023年春予定" },
  "morishita-ryo": { name: "森下遼", no: "04", period: "2019年春〜2023年春", role: "会計" },
  "aizawa-yu": { name: "相沢悠", no: "05", period: "2019年春〜2023年春" },
  "enomoto-sara": { name: "榎本紗良", no: "06", period: "2021年春〜" },
  "shirai-riku": { name: "白井陸", no: "07", period: "2021年春〜" },
  "takase-makoto": { name: "高瀬真琴", no: "08", period: "2022年秋〜" },
  "onodera-shu": { name: "小野寺柊", no: "09", period: "2023年春〜" }
};

const profileRecords = {
  "asakura-jin": { no: "01", role: "発行責任者", publicRecord: "2011年春〜2013年秋", related: [1, 2, 3], graduation: "2014年春 卒業" },
  "ono-mizuki": { no: "02", role: "編集責任者", publicRecord: "2011年春〜2013年秋", related: [1, 2, 3, 4], graduation: "2014年春 卒業" },
  "miyazawa-akari": { no: "03", role: "発行責任者", publicRecord: "2012年春〜2014年秋", related: [1, 2, 3, 4, 5, 6], graduation: "2015年春 卒業" },
  "hirai-naoto": { no: "04", role: "会計", publicRecord: "2012年春〜2014年秋", related: [1, 2, 3, 4, 5, 6], graduation: "2015年春 卒業" },
  "sugihara-mei": { no: "05", role: "発行責任者・編集責任者", publicRecord: "2013年春〜2015年秋", related: [4, 5, 6, 7], graduation: "2016年春 卒業" },
  "kawase-wataru": { no: "06", role: "会計", publicRecord: "2013年春〜2015年秋", related: [5, 6, 7], graduation: "2016年春 卒業" },
  "minamino-taku": { no: "07", role: "発行責任者・編集責任者", publicRecord: "2014年春〜2016年秋", related: [6, 7, 8, 9], graduation: "2017年春 卒業" },
  "fujino-kei": { no: "08", role: "発行責任者", publicRecord: "2015年春〜2017年秋", related: [7, 8, 9, 10], graduation: "2018年春 卒業" },
  "hasegawa-rina": { no: "09", role: "編集責任者", publicRecord: "2015年春〜2017年秋", related: [8, 9, 10, 12], graduation: "2018年春 卒業" },
  "seo-chihiro": { no: "10", role: "会計", publicRecord: "2015年秋〜2018年春", related: [8, 9, 10, 11], graduation: "2018年春 卒業" },
  "kudo-mayu": { no: "11", role: "発行責任者・編集責任者", publicRecord: "2016年春〜2018年秋", related: [9, 10, 11, 12, 13], graduation: "2019年春 卒業" },
  "miyahara-aoi": { no: "12", role: "発行責任者・編集責任者", publicRecord: "2017年春〜2019年秋", related: [11, 12, 13, 14, 15], graduation: "2020年春 卒業" },
  "ishida-wataru": { no: "13", role: "編集責任者・会計", publicRecord: "2017年春〜2019年秋", related: [11, 12, 13, 14, 15], graduation: "2020年春 卒業" },
  "kitamura-kaho": { no: "02", role: "編集責任者・会計", publicRecord: "2018年秋〜2021年春", related: [14, 15, 16, 18, 19], graduation: "2021年春 卒業" },
  "saeki-ryo": { no: "01", role: "発行責任者", publicRecord: "2019年春〜2021年秋", related: [15, 16, 18, 19, 20], graduation: "2022年春 卒業", post: ["2023年　文芸誌新人賞を受賞", "2024年　単行本デビュー", "2025年　短篇集が複数紙で紹介される"], note: "卒業後の活動については、公開情報をもとに最小限の記録のみ掲載しています。" },
  "mihashi-mio": { no: "03", role: "部員", publicRecord: "2019年春〜2021年秋予定", related: [15, 16], works: ["第15号「しずかな机」", "第16号「しずかな机」"], note: "2020年秋以降の公開部員記録には該当記録がありません。" },
  "morishita-ryo": { no: "04", role: "発行責任者・会計", publicRecord: "2019年秋〜2022年春", related: [16, 18, 19, 20, 21], graduation: "2022年春 卒業" },
  "aizawa-yu": { no: "05", role: "編集責任者", publicRecord: "2019年秋〜2022年春", related: [16, 18, 19, 20, 21], graduation: "2022年春 卒業" },
  "enomoto-sara": { no: "06", role: "発行責任者・会計", publicRecord: "2022年春〜2024年秋予定", related: [21, 22, 23], graduation: "なし" },
  "shirai-riku": { no: "07", role: "編集責任者", publicRecord: "2022年春〜2024年秋予定", related: [21, 22, 23], graduation: "なし" },
  "takase-makoto": { no: "08", role: "会計", publicRecord: "2022年秋〜2025年春予定", related: [22, 23], graduation: "なし" },
  "onodera-shu": { no: "09", role: "部員", publicRecord: "2023年春〜2025年秋予定", related: [23], graduation: "なし" }
};

const issueData = [
  issue(1, "2012年春", "2012年4月30日", "A-101-01", [
    work(1, "朝倉仁", "春の廊下"),
    work(2, "小野瑞希", "白い封筒"),
    work(3, "宮沢灯", "自転車置き場"),
    work(4, "平井直人", "午後のチャイム")
  ], [
    member("朝倉仁", "01", "発行責任者"),
    member("小野瑞希", "02", "編集責任者"),
    member("宮沢灯", "03"),
    member("平井直人", "04")
  ], "発行責任者　朝倉仁\n編集責任者　小野瑞希\n発行　未明文芸会", "創刊号です。手探りのまま作った一冊ですが、次号以降も続けていければと思います。"),
  issue(2, "2012年秋", "2012年10月31日", "A-101-02", [
    work(1, "小野瑞希", "秋の窓"),
    work(2, "朝倉仁", "踏切"),
    work(3, "宮沢灯", "机の下"),
    work(4, "平井直人", "消しゴム")
  ], [
    member("朝倉仁", "01", "発行責任者"),
    member("小野瑞希", "02", "編集責任者"),
    member("宮沢灯", "03"),
    member("平井直人", "04")
  ], "発行責任者　朝倉仁\n編集責任者　小野瑞希\n発行　未明文芸会", "前号より少しだけ余裕を持って編集できました。次号は合評会の記録も残せるようにしたいです。"),
  issue(3, "2013年春", "2013年4月30日", "A-101-03", [
    work(1, "宮沢灯", "夜の購買"),
    work(2, "小野瑞希", "透明な袋"),
    work(3, "平井直人", "階段の踊り場"),
    work(4, "朝倉仁", "日曜日")
  ], [
    member("朝倉仁", "01", "発行責任者"),
    member("小野瑞希", "02", "編集責任者"),
    member("宮沢灯", "03"),
    member("平井直人", "04")
  ], "発行責任者　朝倉仁\n編集責任者　小野瑞希\n発行　未明文芸会", "新入生の見学が何人かありました。次号から参加者が増える予定です。"),
  issue(4, "2013年秋", "2013年10月31日", "A-101-04", [
    work(1, "宮沢灯", "水槽"),
    work(2, "平井直人", "雨上がり"),
    work(3, "杉原芽衣", "放課後の棚"),
    work(4, "小野瑞希", "青い傘")
  ], [
    member("小野瑞希", "02", "編集責任者"),
    member("宮沢灯", "03", "発行責任者"),
    member("平井直人", "04"),
    member("杉原芽衣", "05")
  ], "発行責任者　宮沢灯\n編集責任者　小野瑞希\n発行　未明文芸会", "新しい部員の作品が入り、前号とは少し違う雰囲気になりました。"),
  issue(5, "2014年春", "2014年4月30日", "A-101-05", [
    work(1, "杉原芽衣", "花瓶"),
    work(2, "宮沢灯", "朝の線"),
    work(3, "平井直人", "遠いチャイム"),
    work(4, "川瀬航", "ノートの余白")
  ], [
    member("宮沢灯", "03", "発行責任者"),
    member("平井直人", "04"),
    member("杉原芽衣", "05", "編集責任者"),
    member("川瀬航", "06")
  ], "発行責任者　宮沢灯\n編集責任者　杉原芽衣\n発行　未明文芸会", "春号としては少し短い一冊になりました。次号は掲載本数を増やす予定です。"),
  issue(6, "2014年秋", "2014年10月31日", "A-101-06", [
    work(1, "川瀬航", "十月の橋"),
    work(2, "杉原芽衣", "紙の月"),
    work(3, "平井直人", "バス停"),
    work(4, "宮沢灯", "名前を呼ばない")
  ], [
    member("宮沢灯", "03", "発行責任者"),
    member("杉原芽衣", "05", "編集責任者"),
    member("川瀬航", "06"),
    member("南野拓", "07")
  ], "発行責任者　宮沢灯\n編集責任者　杉原芽衣\n発行　未明文芸会", "締切直前まで修正が続きましたが、無事に発行できました。"),
  issue(7, "2015年春", "2015年4月30日", "A-101-07", [
    work(1, "南野拓", "午後の窓"),
    work(2, "川瀬航", "白線"),
    work(3, "杉原芽衣", "封筒"),
    work(4, "藤野圭", "水のない庭")
  ], [
    member("杉原芽衣", "05", "発行責任者"),
    member("川瀬航", "06"),
    member("南野拓", "07", "編集責任者"),
    member("藤野圭", "08")
  ], "発行責任者　杉原芽衣\n編集責任者　南野拓\n発行　未明文芸会", "代替わり後の最初の号です。春らしい作品が多く集まりました。"),
  issue(8, "2015年秋", "2015年10月31日", "A-101-08", [
    work(1, "藤野圭", "水のない庭"),
    work(2, "長谷川莉奈", "紙魚"),
    work(3, "瀬尾千尋", "靴音だけが残る"),
    work(4, "南野拓", "午後の窓")
  ], [
    member("南野拓", "07", "発行責任者"),
    member("藤野圭", "08"),
    member("長谷川莉奈", "09", "編集責任者"),
    member("瀬尾千尋", "10")
  ], "発行責任者　南野拓\n編集責任者　長谷川莉奈\n発行　未明文芸会", "合評会で出た意見をもとに、掲載順を何度か入れ替えました。"),
  issue(9, "2016年春", "2016年4月30日", "A-101-09R", [
    work(1, "長谷川莉奈", "春の欠片"),
    work(2, "藤野圭", "水曜日の庭"),
    work(3, "工藤真由", "名前のない封筒"),
    work(4, "南野拓", "バス停まで")
  ], [
    member("南野拓", "07", "発行責任者"),
    member("藤野圭", "08"),
    member("長谷川莉奈", "09", "編集責任者"),
    member("瀬尾千尋", "10"),
    member("工藤真由", "11")
  ], "発行責任者　南野拓\n編集責任者　長谷川莉奈\n発行　未明文芸会", "新入生向けに配布することを意識して、読みやすい構成にしました。", "登録情報更新版", ["本資料は登録情報を更新した公開版です。", "巻末掲載情報の一部を非表示にしています。", "表示調整の処理記録は更新履歴に記載しています。"]),
  issue(10, "2016年秋", "2016年10月31日", "A-101-10", [
    work(1, "工藤真由", "夜の階段"),
    work(2, "瀬尾千尋", "コップの底"),
    work(3, "藤野圭", "白線"),
    work(4, "長谷川莉奈", "音のしない部屋")
  ], [
    member("藤野圭", "08", "発行責任者"),
    member("長谷川莉奈", "09", "編集責任者"),
    member("瀬尾千尋", "10"),
    member("工藤真由", "11")
  ], "発行責任者　藤野圭\n編集責任者　長谷川莉奈\n発行　未明文芸会", "秋号らしく、夜や帰り道を扱った作品が多くなりました。"),
  issue(11, "2017年春", "2017年4月30日", "A-101-11", [
    work(1, "宮原葵", "葉桜"),
    work(2, "石田航", "自転車置き場"),
    work(3, "工藤真由", "雨傘"),
    work(4, "瀬尾千尋", "遠いチャイム")
  ], [
    member("藤野圭", "08", "発行責任者"),
    member("工藤真由", "11", "編集責任者"),
    member("宮原葵", "12"),
    member("石田航", "13")
  ], "発行責任者　藤野圭\n編集責任者　工藤真由\n発行　未明文芸会", "今号から新しい部員の作品が加わりました。"),
  issue(12, "2017年秋", "2017年10月31日", "A-101-12", [
    work(1, "宮原葵", "夜行"),
    work(2, "石田航", "踏切の向こう"),
    work(3, "長谷川莉奈", "透明な袋"),
    work(4, "南野拓", "机上")
  ], [
    member("工藤真由", "11", "発行責任者"),
    member("宮原葵", "12", "編集責任者"),
    member("石田航", "13"),
    member("長谷川莉奈", "09")
  ], "発行責任者　工藤真由\n編集責任者　宮原葵\n発行　未明文芸会", "掲載本数は少なめですが、作品ごとの雰囲気はよく分かれる号になりました。"),
  issue(13, "2018年春", "2018年4月30日", "A-101-13", [
    work(1, "藤野圭", "夏の名前"),
    work(2, "宮原葵", "犬のいない道"),
    work(3, "工藤真由", "まだ乾かない封筒"),
    work(4, "石田航", "帰り道の話")
  ], [
    member("宮原葵", "12", "発行責任者"),
    member("石田航", "13", "編集責任者"),
    member("工藤真由", "11")
  ], "発行責任者　宮原葵\n編集責任者　石田航\n発行　未明文芸会", "春号としては落ち着いた作品が集まりました。"),
  issue(14, "2018年秋", "2018年10月31日", "A-101-14", [
    work(1, "北村夏帆", "雨の底"),
    work(2, "森下遼", "駅前の犬"),
    work(3, "相沢悠", "窓辺"),
    work(4, "瀬尾千尋", "朝の線")
  ], [
    member("宮原葵", "12", "発行責任者"),
    member("石田航", "13", "編集責任者"),
    member("佐伯亮", "01"),
    member("北村夏帆", "02"),
    member("森下遼", "04"),
    member("相沢悠", "05")
  ], "発行責任者　宮原葵\n編集責任者　石田航\n発行　未明文芸会", "新しい部員の作品が増え、合評会の時間も長くなりました。"),
  issue(15, "2019年春", "2019年4月30日", "A-101-15", [
    work(1, "佐伯亮", "白い廊下"),
    work(2, "北村夏帆", "水曜日の窓"),
    work(3, "三橋澪", "しずかな机"),
    work(4, "森下遼", "駅前の犬"),
    work(5, "相沢悠", "窓辺")
  ], [
    member("佐伯亮", "01"),
    member("北村夏帆", "02"),
    member("三橋澪", "03"),
    member("森下遼", "04"),
    member("相沢悠", "05"),
    member("宮原葵", "12", "発行責任者"),
    member("石田航", "13", "編集責任者")
  ], "発行責任者　宮原葵\n編集責任者　石田航\n発行　未明文芸会", "新入部員の作品を多く掲載しました。次号から編集体制を一部変更する予定です。"),
  issue(16, "2019年秋", "2019年10月31日", "A-101-16", [
    work(1, "北村夏帆", "雨の底"),
    work(2, "佐伯亮", "余白の午後"),
    work(3, "三橋澪", "しずかな机"),
    work(4, "森下遼", "バス停まで"),
    work(5, "相沢悠", "窓辺の紙")
  ], [
    member("佐伯亮", "01", "発行責任者"),
    member("北村夏帆", "02", "編集責任者"),
    member("三橋澪", "03"),
    member("森下遼", "04"),
    member("相沢悠", "05")
  ], "発行責任者　佐伯亮\n編集責任者　北村夏帆\n発行　未明文芸会", "掲載本数が増えたため、合評会を二回に分けて行いました。"),
  issue(18, "2020年秋", "2020年10月31日", "A-101-18", [
    work(1, "佐伯亮", "屋上の椅子"),
    work(2, "北村夏帆", "水曜日の窓"),
    work(3, "森下遼", "駅前の犬"),
    work(4, "相沢悠", "春の棚")
  ], [
    member("佐伯亮", "01", "発行責任者"),
    member("北村夏帆", "02", "編集責任者"),
    member("森下遼", "04"),
    member("相沢悠", "05")
  ], "発行責任者　佐伯亮\n編集責任者　北村夏帆\n発行　未明文芸会", "今号は発行時期が遅れましたが、予定していた作品を掲載できました。"),
  issue(19, "2021年春", "2021年4月30日", "A-101-19", [
    work(1, "北村夏帆", "薄い封筒"),
    work(2, "森下遼", "駅前の犬・二"),
    work(3, "相沢悠", "花瓶"),
    work(4, "佐伯亮", "斜面")
  ], [
    member("佐伯亮", "01", "発行責任者"),
    member("北村夏帆", "02", "編集責任者"),
    member("森下遼", "04"),
    member("相沢悠", "05")
  ], "発行責任者　佐伯亮\n編集責任者　北村夏帆\n発行　未明文芸会", "オンラインでの合評も増えましたが、発行作業は通常通り行いました。"),
  issue(20, "2021年秋", "2021年10月31日", "A-101-20", [
    work(1, "森下遼", "月曜の会話"),
    work(2, "相沢悠", "空き教室"),
    work(3, "北村夏帆", "雨のない日"),
    work(4, "佐伯亮", "遠い斜面")
  ], [
    member("佐伯亮", "01", "発行責任者"),
    member("北村夏帆", "02", "編集責任者"),
    member("森下遼", "04"),
    member("相沢悠", "05")
  ], "発行責任者　佐伯亮\n編集責任者　北村夏帆\n発行　未明文芸会", "卒業を控えた部員の作品が多く、落ち着いた一冊になりました。"),
  issue(21, "2022年春", "2022年4月30日", "A-101-21", [
    work(1, "森下遼", "コンビニまで"),
    work(2, "相沢悠", "青いレシート"),
    work(3, "榎本紗良", "春の棚"),
    work(4, "白井陸", "夜の自転車")
  ], [
    member("森下遼", "04", "発行責任者"),
    member("相沢悠", "05", "編集責任者"),
    member("榎本紗良", "06"),
    member("白井陸", "07")
  ], "発行責任者　森下遼\n編集責任者　相沢悠\n発行　未明文芸会", "新しい編集体制での最初の号です。作品数は少なめですが、次号以降も継続していきます。"),
  issue(22, "2022年秋", "2022年10月31日", "A-101-22", [
    work(1, "相沢悠", "小さな紙袋"),
    work(2, "榎本紗良", "水色の封筒"),
    work(3, "白井陸", "駅の裏側"),
    work(4, "高瀬真琴", "名前を呼ばない")
  ], [
    member("森下遼", "04", "発行責任者"),
    member("相沢悠", "05", "編集責任者"),
    member("榎本紗良", "06"),
    member("白井陸", "07"),
    member("高瀬真琴", "08")
  ], "発行責任者　森下遼\n編集責任者　相沢悠\n発行　未明文芸会", "秋号としては久しぶりに投稿数が増えました。掲載順は合評会後に調整しました。"),
  issue(23, "2023年春", "2023年4月30日", "A-101-23R", [
    work(1, "榎本紗良", "春の棚"),
    work(2, "白井陸", "遠い犬"),
    work(3, "高瀬真琴", "水色の封筒"),
    work(4, "小野寺柊", "遅い窓")
  ], [
    member("榎本紗良", "06", "発行責任者"),
    member("白井陸", "07", "編集責任者"),
    member("高瀬真琴", "08"),
    member("小野寺柊", "09")
  ], "発行責任者　榎本紗良\n編集責任者　白井陸\n発行　未明文芸会", "公開版の再登録にあたり、一部表示を調整しました。", "登録情報更新版", ["本資料は登録情報を更新した公開版です。", "投稿者名の一部を非表示にしています。", "表示調整の処理記録は更新履歴に記載しています。"])
];

const restricted17 = {
  number: 17,
  publicationDate: "2020年4月30日",
  materialId: "A-410-17",
  status: "非公開資料",
  works: [
    work(1, "北村夏帆", "雨の底"),
    work(2, "森下遼", "駅前の犬"),
    work(3, "三橋澪", "午前二時のコピー機"),
    work(4, "相沢悠", "窓辺"),
    work(5, "佐伯亮", "白い廊下")
  ],
  members: [
    member("佐伯亮", "01", "発行責任者"),
    member("北村夏帆", "02", "編集責任者"),
    member("三橋澪", "03"),
    member("森下遼", "04"),
    member("相沢悠", "05")
  ],
  colophon: "発行責任者　佐伯亮\n編集責任者　北村夏帆\n発行　未明文芸会",
  afterword: "本文記録の一部は表示対象外です。"
};

const updateLines = [
  "2012年4月5日　『未明』公開資料の登録を開始しました。　処理記録：MR-2012-0405",
  "2012年4月30日　『未明』第1号の公開版を登録しました。",
  "2012年10月31日　『未明』第2号の公開版を登録しました。",
  "2013年4月30日　『未明』第3号の公開版を登録しました。",
  "2013年10月31日　『未明』第4号の公開版を登録しました。",
  "2014年4月30日　『未明』第5号の公開版を登録しました。",
  "2014年10月31日　『未明』第6号の公開版を登録しました。",
  "2015年4月30日　『未明』第7号の公開版を登録しました。",
  "2015年10月31日　『未明』第8号の公開版を登録しました。",
  "2016年4月30日　『未明』第9号の公開版を登録しました。",
  "2016年5月2日　『未明』第9号を非公開資料に移行しました。",
  "2016年5月9日　『未明』第9号の公開版を再登録しました。　処理記録：MR-2016-0509",
  "2016年10月31日　『未明』第10号の公開版を登録しました。",
  "2017年4月30日　『未明』第11号の公開版を登録しました。",
  "2017年10月31日　『未明』第12号の公開版を登録しました。",
  "2018年4月30日　『未明』第13号の公開版を登録しました。",
  "2018年10月31日　『未明』第14号の公開版を登録しました。",
  "2019年4月30日　『未明』第15号の公開版を登録しました。",
  "2019年10月31日　『未明』第16号の公開版を登録しました。",
  "2020年6月12日　『未明』第17号を非公開資料に移行しました。　処理記録：MR-2020-0612",
  "2020年10月31日　『未明』第18号の公開版を登録しました。",
  "2021年4月30日　『未明』第19号の公開版を登録しました。",
  "2021年10月31日　『未明』第20号の公開版を登録しました。",
  "2022年4月30日　『未明』第21号の公開版を登録しました。",
  "2022年10月31日　『未明』第22号の公開版を登録しました。",
  "2023年3月20日　『未明』第23号の公開版を再登録しました。　処理記録：MR-2023-0320",
  "2023年4月30日　当サイトにおける『未明』公開資料の追加更新を停止しました。　処理記録：MR-2023-0430"
];

const memberRecords = [
  ["2012年春", ["朝倉仁 01 発行責任者", "小野瑞希 02 編集責任者", "宮沢灯 03", "平井直人 04"]],
  ["2012年秋", ["朝倉仁 01 発行責任者", "小野瑞希 02 編集責任者", "宮沢灯 03", "平井直人 04"]],
  ["2013年春", ["朝倉仁 01 発行責任者", "小野瑞希 02 編集責任者", "宮沢灯 03", "平井直人 04"]],
  ["2013年秋", ["小野瑞希 02 編集責任者", "宮沢灯 03 発行責任者", "平井直人 04", "杉原芽衣 05"]],
  ["2014年春", ["宮沢灯 03 発行責任者", "平井直人 04", "杉原芽衣 05 編集責任者", "川瀬航 06"]],
  ["2014年秋", ["宮沢灯 03 発行責任者", "杉原芽衣 05 編集責任者", "川瀬航 06", "南野拓 07"]],
  ["2015年春", ["杉原芽衣 05 発行責任者", "川瀬航 06", "南野拓 07 編集責任者", "藤野圭 08"]],
  ["2015年秋", ["南野拓 07 発行責任者", "藤野圭 08", "長谷川莉奈 09 編集責任者", "瀬尾千尋 10"]],
  ["2016年春", ["南野拓 07 発行責任者", "藤野圭 08", "長谷川莉奈 09 編集責任者", "瀬尾千尋 10", "工藤真由 11"]],
  ["2016年秋", ["藤野圭 08 発行責任者", "長谷川莉奈 09 編集責任者", "瀬尾千尋 10", "工藤真由 11"]],
  ["2017年春", ["藤野圭 08 発行責任者", "工藤真由 11 編集責任者", "宮原葵 12", "石田航 13"]],
  ["2017年秋", ["工藤真由 11 発行責任者", "宮原葵 12 編集責任者", "石田航 13", "長谷川莉奈 09"]],
  ["2018年春", ["宮原葵 12 発行責任者", "石田航 13 編集責任者", "工藤真由 11"]],
  ["2018年秋", ["宮原葵 12 発行責任者", "石田航 13 編集責任者", "佐伯亮 01", "北村夏帆 02", "森下遼 04", "相沢悠 05"]],
  ["2019年春", ["佐伯亮 01", "北村夏帆 02", "三橋澪 03", "森下遼 04", "相沢悠 05", "宮原葵 12 発行責任者", "石田航 13 編集責任者"]],
  ["2019年秋", ["佐伯亮 01 発行責任者", "北村夏帆 02 編集責任者", "三橋澪 03", "森下遼 04", "相沢悠 05"]],
  ["2020年春", ["佐伯亮 01 発行責任者", "北村夏帆 02 編集責任者", "森下遼 04", "相沢悠 05"]],
  ["2020年秋", ["佐伯亮 01 発行責任者", "北村夏帆 02 編集責任者", "森下遼 04", "相沢悠 05"]],
  ["2021年春", ["佐伯亮 01 発行責任者", "北村夏帆 02 編集責任者", "森下遼 04", "相沢悠 05"]],
  ["2021年秋", ["佐伯亮 01 発行責任者", "北村夏帆 02 編集責任者", "森下遼 04", "相沢悠 05"]],
  ["2022年春", ["森下遼 04 発行責任者", "相沢悠 05 編集責任者", "榎本紗良 06", "白井陸 07"]],
  ["2022年秋", ["森下遼 04 発行責任者", "相沢悠 05 編集責任者", "榎本紗良 06", "白井陸 07", "高瀬真琴 08"]],
  ["2023年春", ["榎本紗良 06 発行責任者", "白井陸 07 編集責任者", "高瀬真琴 08", "小野寺柊 09"]]
];

const editorialRecords = [
  ["2012年度前期〜2013年度前期 編集体制", ["発行責任者　朝倉仁　担当者番号01", "編集責任者　小野瑞希　担当者番号02", "会計　　　　平井直人　担当者番号04"]],
  ["2013年度後期 編集体制", ["発行責任者　宮沢灯　担当者番号03", "編集責任者　小野瑞希　担当者番号02", "会計　　　　平井直人　担当者番号04"]],
  ["2014年度前期〜2014年度後期 編集体制", ["発行責任者　宮沢灯　担当者番号03", "編集責任者　杉原芽衣　担当者番号05", "会計　　　　川瀬航　担当者番号06"]],
  ["2015年度前期 編集体制", ["発行責任者　杉原芽衣　担当者番号05", "編集責任者　南野拓　担当者番号07", "会計　　　　川瀬航　担当者番号06"]],
  ["2015年度後期〜2016年度前期 編集体制", ["発行責任者　南野拓　担当者番号07", "編集責任者　長谷川莉奈　担当者番号09", "会計　　　　瀬尾千尋　担当者番号10"]],
  ["2016年度後期 編集体制", ["発行責任者　藤野圭　担当者番号08", "編集責任者　長谷川莉奈　担当者番号09", "会計　　　　工藤真由　担当者番号11"]],
  ["2017年度前期 編集体制", ["発行責任者　藤野圭　担当者番号08", "編集責任者　工藤真由　担当者番号11", "会計　　　　石田航　担当者番号13"]],
  ["2017年度後期 編集体制", ["発行責任者　工藤真由　担当者番号11", "編集責任者　宮原葵　担当者番号12", "会計　　　　石田航　担当者番号13"]],
  ["2018年度前期 編集体制", ["発行責任者　宮原葵　担当者番号12", "編集責任者　石田航　担当者番号13", "会計　　　　工藤真由　担当者番号11"]],
  ["2018年度後期〜2019年度前期 編集体制", ["発行責任者　宮原葵　担当者番号12", "編集責任者　石田航　担当者番号13", "会計　　　　北村夏帆　担当者番号02"]],
  ["2019年度後期〜2020年度前期 編集体制", ["発行責任者　佐伯亮　担当者番号01", "編集責任者　北村夏帆　担当者番号02", "会計　　　　森下遼　担当者番号04"]],
  ["2020年度後期〜2021年度前期 編集体制", ["発行責任者　佐伯亮　担当者番号01", "編集責任者　北村夏帆　担当者番号02", "会計　　　　森下遼　担当者番号04"]],
  ["2021年度後期 編集体制", ["発行責任者　佐伯亮　担当者番号01", "編集責任者　相沢悠　担当者番号05", "会計　　　　森下遼　担当者番号04"]],
  ["2022年度前期 編集体制", ["発行責任者　森下遼　担当者番号04", "編集責任者　相沢悠　担当者番号05", "会計　　　　榎本紗良　担当者番号06"]],
  ["2022年度後期〜2023年度前期 編集体制", ["発行責任者　榎本紗良　担当者番号06", "編集責任者　白井陸　担当者番号07", "会計　　　　高瀬真琴　担当者番号08"]]
];

const graduateRecords = [
  ["2014年春 卒業", ["朝倉仁", "小野瑞希"]],
  ["2015年春 卒業", ["宮沢灯", "平井直人"]],
  ["2016年春 卒業", ["杉原芽衣", "川瀬航"]],
  ["2017年春 卒業", ["南野拓"]],
  ["2018年春 卒業", ["藤野圭", "長谷川莉奈", "瀬尾千尋"]],
  ["2019年春 卒業", ["工藤真由"]],
  ["2020年春 卒業", ["宮原葵", "石田航"]],
  ["2021年春 卒業", ["北村夏帆"]],
  ["2022年春 卒業", ["佐伯亮", "森下遼", "相沢悠"]]
];

const css = `
:root{--text:#1f1f1f;--muted:#5e5e5e;--line:#cfcfcf;--link:#0645ad;--visited:#4b2e83;--surface:#f8f8f8}
*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--text);font-family:"Yu Mincho","Hiragino Mincho ProN","Noto Serif JP","Times New Roman",serif;font-size:16px;line-height:1.8}
a{color:var(--link);text-decoration:underline;text-underline-offset:.18em}a:visited{color:var(--visited)}
.page-shell{width:min(960px,calc(100% - 32px));margin:0 auto}.site-header{padding:22px 0 14px;border-bottom:1px solid var(--line)}
.site-title{margin-bottom:12px;font-size:1.65rem;font-weight:600}.site-title a{color:var(--text);text-decoration:none}
.main-nav{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:.95rem}.main-nav a{white-space:nowrap}main{padding:32px 0 56px}.site-footer{padding:22px 0 36px;border-top:1px solid var(--line);color:var(--muted);font-size:.9rem}
h1,h2,h3{line-height:1.45;font-weight:600}h1{margin:0 0 22px;font-size:1.8rem}h2{margin:0 0 14px;font-size:1.25rem}h3{margin:24px 0 8px;font-size:1.05rem}
p{margin:0 0 1em}.lead{max-width:760px}.section{margin-top:30px;padding-top:22px;border-top:1px solid var(--line)}.plain-list{margin:0;padding-left:1.35em}.plain-list li{margin:.15em 0}
table{width:100%;border-collapse:collapse;margin:12px 0 18px}th,td{padding:8px 10px;border:1px solid var(--line);text-align:left;vertical-align:top}th{background:var(--surface);font-weight:600}.meta-table th{width:11em}.works td:first-child{width:4em}
.note{margin:14px 0;padding:12px 14px;border:1px solid var(--line);background:#fbfbfb}.muted{color:var(--muted)}.footer-admin{font-size:.85em}.search-result{padding:13px 0;border-bottom:1px solid var(--line)}.search-result h2{margin-bottom:4px;font-size:1.05rem}
.form-grid{display:grid;gap:14px;max-width:720px}label{display:grid;gap:4px}input,button{font:inherit}input{width:100%;padding:8px 9px;border:1px solid #9a9a9a;background:#fff;color:var(--text)}button{display:inline-block;width:fit-content;padding:7px 16px;border:1px solid #555;background:#efefef;color:var(--text);cursor:pointer}
@media(max-width:640px){.page-shell{width:min(100% - 22px,960px)}body{font-size:15px}.site-title{font-size:1.4rem}main{padding-top:24px}th,td{padding:7px 6px}.meta-table th{width:8em}}
`;

function issue(number, season, date, materialId, works, members, colophon, afterword, status = "公開資料", note = []) {
  return { number, season, date, materialId, works, members, colophon, afterword, status, note };
}

function work(page, author, title, excerpt = "", body = "") {
  return { page, author, title, excerpt, body };
}

function member(name, no, role = "") {
  return { name, no, role };
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function link(href, label) {
  return `<a href="${href}">${escapeHtml(label)}</a>`;
}

function page(title, body, options = {}) {
  const robots = options.noindex ? '<meta name="robots" content="noindex,nofollow">' : "";
  const verification = googleSiteVerification ? `<meta name="google-site-verification" content="${escapeHtml(googleSiteVerification)}">` : "";
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${robots}${verification}<title>${escapeHtml(title)} | 未明文芸会資料室</title><style>${css}</style></head><body><div class="page-shell"><header class="site-header"><div class="site-title"><a href="/">未明文芸会資料室</a></div><nav class="main-nav" aria-label="公開ナビ">${nav.map(([href, label]) => link(href, label)).join("")}</nav></header><main>${body}</main><footer class="site-footer"><span class="footer-admin">© 未明文芸会資料室　｜　${link("/admin", "管理用")}</span></footer></div></body></html>`;
}

function section(title, body) {
  return `<section class="section"><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function list(items) {
  return `<ul class="plain-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function table(headers, rows, className = "") {
  return `<table${className ? ` class="${className}"` : ""}><thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function meta(rows) {
  return `<table class="meta-table"><tbody>${rows.map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${v}</td></tr>`).join("")}</tbody></table>`;
}

function worksTable(works) {
  return table(["頁", "作者", "作品名"], works.map((w) => [String(w.page).padStart(2, "0"), escapeHtml(w.author), `「${escapeHtml(w.title)}」`]), "works");
}

function membersTable(members) {
  return table(["氏名", "担当者番号", "役職"], members.map((m) => [escapeHtml(m.name), escapeHtml(m.no), escapeHtml(m.role)]));
}

function lines(text) {
  return list(text.split("\n"));
}

function normalize(value) {
  let s = String(value || "")
    .replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/[\u30a1-\u30f6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
    .trim();
  const pairs = [
    ["第二十三号", "第23号"], ["二十三号", "23号"], ["二十三", "23"],
    ["第二十号", "第20号"], ["二十号", "20号"], ["二十", "20"],
    ["第十八号", "第18号"], ["十八号", "18号"], ["十八", "18"],
    ["第十七号", "第17号"], ["十七号", "17号"], ["十七", "17"],
    ["第十六号", "第16号"], ["十六号", "16号"], ["十六", "16"],
    ["第九号", "第9号"], ["九号", "9号"], ["九", "9"],
    ["未名", "未明"], ["未命", "未明"], ["未明文学会", "未明文芸会"], ["未明文芸部", "未明文芸会"],
    ["三箸", "三橋"], ["三橋零", "三橋澪"], ["佐伯涼", "佐伯亮"], ["北村夏歩", "北村夏帆"]
  ];
  for (const [from, to] of pairs) s = s.replaceAll(from, to);
  s = s.replace(/[‐‑‒–—―−ーｰ－]/g, "-").replace(/\s+/g, "-").replace(/-+/g, "-").toUpperCase();
  return { normalized: s, compact: s.replace(/-/g, "") };
}

function materialId(value) {
  const c = normalize(value).compact;
  let m = c.match(/^A(\d{3})(\d{2,3})(R?)$/);
  if (m) return `A-${m[1]}-${m[2].slice(-2)}${m[3]}`;
  m = c.match(/^(101|410)(\d{2,3})(R?)$/);
  if (m) return `A-${m[1]}-${m[2].slice(-2)}${m[3]}`;
  m = c.match(/^B(\d{3})(\d{2,3})(R?)$/);
  if (m) return `B-${m[1]}-${m[2].slice(-2)}${m[3]}`;
  return null;
}

function roleId(value) {
  const m = normalize(value).compact.match(/^(PB|ED|AC)(\d{2})(\d{2})$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

function managementRecordId(value) {
  const m = normalize(value).compact.match(/^MR(\d{4})(\d{4})$/);
  if (!m) return null;
  return `MR-${m[1]}-${m[2]}`;
}

function internalNoticeId(value) {
  const c = normalize(value).compact;
  const m = c.match(/^(?:部内通知)?2012(0[1-5])$/);
  return m ? `2012-${m[1]}` : null;
}

function has(query, terms) {
  const q = normalize(query);
  return terms.some((term) => {
    const t = normalize(term);
    return q.normalized.includes(t.normalized) || q.compact.includes(t.compact);
  });
}

function isExactTerm(query, terms) {
  const q = normalize(query);
  return terms.some((term) => {
    const t = normalize(term);
    return q.normalized === t.normalized || q.compact === t.compact;
  });
}

function addResult(results, title, href, excerpt) {
  const key = `${title}|${href}|${excerpt}`;
  if (!results.some((item) => item.key === key)) results.push({ key, title, href, excerpt });
}

function publicAdminRedirect(message) {
  return `<p>該当する公開資料は見つかりませんでした。<br>${escapeHtml(message)}</p>`;
}

function resultHtml(results) {
  if (!results.length) return `<p>該当する公開資料は見つかりませんでした。表記を変えて検索するか、既刊一覧をご参照ください。</p>${candidateLinks()}`;
  return results.map((r) => `<article class="search-result"><h2>${r.href ? link(r.href, r.title) : escapeHtml(r.title)}</h2><p>${escapeHtml(r.excerpt)}</p></article>`).join("");
}

function candidateLinks() {
  return `<p>候補：${link("/issues", "既刊一覧")} ／ ${link("/updates", "更新履歴")} ／ ${link("/members", "部員記録")}</p>`;
}

function searchPage(url) {
  const q = url.searchParams.get("q") || "";
  const managerId = url.searchParams.get("managerId") || "";
  const shownQuery = shouldSuppressQueryEcho(q) ? "" : q;
  const body = `<h1>資料室内検索</h1><form class="form-grid" action="/search" method="get"><label>検索語<input name="q" type="search" value="${escapeHtml(shownQuery)}"></label><button type="submit">検索</button></form>${q.trim() ? section("検索結果", getSearchHtml(q, managerId)) : section("検索について", `<p>号数、資料名、資料番号、部員名、役職などで検索できます。</p>`)}`;
  return page("資料室内検索", body, { noindex: Boolean(q.trim()) });
}

function shouldSuppressQueryEcho(query) {
  return has(query, ["架空", "ARG", "謎解き", "創作企画", "読者に解かせる"]);
}

function getSearchHtml(q, managerId = "") {
  const id = materialId(q);
  const rid = roleId(q);
  const compact = normalize(q).compact;
  const results = [];

  if (has(q, ["盗作", "パクリ", "剽窃", "盗用", "犯人", "真相", "答え", "攻略", "ヒント", "謎解き", "ARG"])) {
    return `<p>該当する公開資料は見つかりませんでした。</p>`;
  }

  if (!q.trim()) return `<p>検索語を入力してください。</p>`;

  if (managementRecordId(q)) {
    return publicAdminRedirect("処理記録番号は、管理用ページで確認してください。");
  }

  if (internalNoticeId(q)) {
    return publicAdminRedirect("部内通知は、管理用ページで確認してください。");
  }

  if (isA41017Query(q, id) || (id || "").startsWith("A-410-") || isExactTerm(q, ["A-410", "A410", "410", "旧管理番号", "非公開資料番号"])) {
    return publicAdminRedirect("制限資料番号は、管理用ページで確認してください。");
  }

  if (rid || isExactTerm(q, ["照会ID", "発行時点の照会ID", "発行責任者ID", "役職コード", "PB", "ED", "AC"])) {
    return `<p>該当する公開資料は見つかりませんでした。<br>照会IDは、対象資料の照会画面で使用してください。</p>`;
  }

  if (["A-101-17"].includes(id || "") || has(q, ["101-17", "10117"])) {
    return `<p>該当する通常公開資料は見つかりませんでした。<br>非公開資料に移行した資料は、通常公開番号では照会できません。</p><p>候補：${link("/issues", "既刊一覧")} ／ ${link("/updates", "更新履歴")}</p>`;
  }

  if (["A-101-01R", "A-101-02R"].includes(id || "")) {
    addResult(results, "資料番号について", "/material-numbers", "資料番号の形式を参照できます。");
    return `<p>該当する公開資料は見つかりませんでした。資料番号の形式については、資料番号についてをご参照ください。</p>${resultHtml(results)}`;
  }

  if (id === "A-410-16") return `<p>該当する非公開資料は見つかりませんでした。第16号は通常公開資料として登録されています。</p><p>${link("/issues/16", "第16号")}</p>`;
  if (id === "A-410-18") return `<p>該当する非公開資料は見つかりませんでした。第18号は通常公開資料として登録されています。</p><p>${link("/issues/18", "第18号")}</p>`;
  if ((id || "").startsWith("B-")) return `<p>B区分の該当資料は見つかりませんでした。</p>`;
  if (["A-411-17", "A-401-17"].includes(id || "")) return `<p>近い形式の資料番号があります。</p><p>候補：${link("/material-numbers", "資料番号について")} ／ ${link("/search", "資料室内検索")}</p>`;

  if (has(q, ["午前二時のコピー機", "午前2時のコピー機", "午前二時", "午前2時", "コピー機", "こぴーき", "コピー", "二時のコピー機", "ごぜんにじのコピー機", "二時", "午前", "copy machine", "2am copier", "2 am copy"])) {
    return `<p>該当する公開資料は見つかりませんでした。<br>表記を変えて検索するか、既刊一覧をご参照ください。</p>`;
  }

  if (has(q, ["改稿履歴", "差分", "編集履歴", "本文履歴", "本文記録", "非表示履歴", "非表示の本文記録", "改稿", "修正前", "旧版"])) {
    return `<p>一部資料には非表示の履歴があります。公開範囲外です。</p>`;
  }

  if (has(q, ["資料管理基準", "管理基準", "資料管理の基準", "公開範囲の基準", "表示調整の基準"])) {
    return `<p>該当する公開資料は見つかりませんでした。</p><p>資料番号や公開範囲の処理は、更新履歴の処理記録に記載しています。<br>関連語：処理記録、公開範囲、表示調整</p><p>候補：${link("/material-numbers", "資料番号について")} ／ ${link("/updates", "更新履歴")} ／ ${link("/search", "資料室内検索")}</p>`;
  }

  if (has(q, ["公開資料登録", "登録形式", "公開資料の登録", "A-101", "資料番号 A-101"])) {
    addResult(results, "資料番号について", "/material-numbers", "資料番号の基本的な区分を参照できます。");
    addResult(results, "既刊一覧", "/issues", "公開資料として登録された部誌の資料番号を参照できます。");
    addResult(results, "参考：部内通知 2012-01　公開資料登録の基本について", "", "部内通知は管理用ページで確認してください。");
    return resultHtml(results);
  }

  if (has(q, ["公開範囲", "表示調整", "非表示", "公開対象外", "公開範囲の確認", "表示範囲"])) {
    addResult(results, "資料番号について", "/material-numbers", "資料番号の基本的な区分を参照できます。");
    addResult(results, "更新履歴", "/updates", "公開範囲を変更した資料の処理記録があります。");
    addResult(results, "参考：部内通知 2012-02　公開範囲と表示調整について", "", "部内通知は管理用ページで確認してください。");
    return resultHtml(results);
  }

  if (has(q, ["更新停止", "追加更新停止", "公開資料追加更新", "公開資料の追加更新", "更新終了"])) {
    addResult(results, "更新履歴", "/updates", "公開資料の追加更新停止に関する処理記録があります。");
    addResult(results, "参考：部内通知 2012-05　公開資料追加更新の停止について", "", "部内通知は管理用ページで確認してください。");
    return resultHtml(results);
  }

  if (isExactTerm(q, ["発行責任者", "発行責任者とは"])) {
    addResult(results, "部員記録", "/members", "年度別の公開部員記録です。");
    addResult(results, "資料室内検索", "/search", "表記を変えて検索できます。");
    return resultHtml(results);
  }

  if (has(q, ["発行時点編集体制", "発行期別編集体制", "年度別編集体制", "編集体制", "発行体制", "担当者一覧", "2012年度前期", "2012年度後期", "2013年度前期", "2013年度後期", "2014年度前期", "2014年度後期", "2015年度前期", "2015年度後期", "2016年度前期", "2016年度後期", "2017年度前期", "2017年度後期", "2018年度前期", "2018年度後期", "2019年度前期", "2019年度後期", "2020年度前期", "2020年度後期", "2021年度前期", "2021年度後期", "2022年度前期", "2022年度後期", "2023年度前期"])) {
    addResult(results, "発行時点編集体制", "/editorial-structure", "各発行時点の発行責任者、編集責任者、会計を参照できます。");
    return resultHtml(results);
  }

  if (has(q, ["卒業", "卒業生", "卒業記録", "OB", "OG", "在籍終了", "卒業者", "過去部員"])) {
    addResult(results, "卒業生記録", "/graduates", "公開されている卒業生記録です。");
    addResult(results, "部員記録", "/members", "年度別の公開部員記録です。");
    addResult(results, "資料室内検索", "/search", "表記を変えて検索できます。");
    return resultHtml(results);
  }

  if (isExactTerm(q, ["資料番号", "管理番号", "資料番号とは", "管理番号とは", "番号", "A-101", "公開資料番号", "資料の番号"])) {
    addResult(results, "資料番号について", "/material-numbers", "資料番号の基本的な区分を参照できます。");
    addResult(results, "既刊一覧", "/issues", "公開資料として登録された部誌の資料番号を参照できます。");
    addResult(results, "資料室内検索", "/search", "資料名、号数、資料番号などを入力して照会できます。");
    return resultHtml(results);
  }

  if (has(q, ["非公開資料", "公開停止資料", "公開停止", "公開されていません", "表示できません", "公開停止資料の照会"])) {
    addResult(results, "資料番号について", "/material-numbers", "資料番号の基本的な区分を参照できます。");
    addResult(results, "『未明』第17号 公開停止ページ", "/issues/17", "この資料は現在公開されていません。");
    addResult(results, "更新履歴", "/updates", "公開範囲を変更した資料の記録があります。");
    addResult(results, "資料室内検索", "/search", "資料番号や公開範囲に関する語で検索できます。");
    return resultHtml(results);
  }

  if (isExactTerm(q, ["R", "R付き", "Rつき"])) {
    addResult(results, "資料番号について", "/material-numbers", "資料番号の基本的な区分を参照できます。");
    addResult(results, "既刊一覧", "/issues", "公開資料として登録された部誌の資料番号を参照できます。");
    return resultHtml(results);
  }

  if (isExactTerm(q, ["09R", "9R", "A-101-09R", "A10109R"])) {
    addResult(results, "『未明』第9号", "/issues/9", "登録情報を更新した公開版です。");
    addResult(results, "資料番号について", "/material-numbers", "資料番号の基本的な区分を参照できます。");
    addResult(results, "更新履歴", "/updates", "登録情報の更新履歴を参照できます。");
    return resultHtml(results);
  }

  if (isExactTerm(q, ["23R", "A-101-23R", "A10123R"])) {
    addResult(results, "『未明』第23号", "/issues/23", "登録情報を更新した公開版です。");
    addResult(results, "資料番号について", "/material-numbers", "資料番号の基本的な区分を参照できます。");
    addResult(results, "更新履歴", "/updates", "登録情報の更新履歴を参照できます。");
    return resultHtml(results);
  }

  if (has(q, ["再登録", "公開版再登録", "登録情報 更新", "登録情報が更新された公開版", "更新された公開版"])) {
    addResult(results, "更新履歴", "/updates", "登録情報の更新履歴を参照できます。");
    addResult(results, "資料番号について", "/material-numbers", "資料番号の基本的な区分を参照できます。");
    addResult(results, "『未明』第9号", "/issues/9", "登録情報を更新した公開版です。");
    addResult(results, "『未明』第23号", "/issues/23", "登録情報を更新した公開版です。");
    return resultHtml(results);
  }

  if (has(q, ["17", "17号", "第17号", "十七号", "第十七号", "未明17", "未明 第17号", "第17", "十七", "17ごう"])) {
    addResult(results, "『未明』第17号 公開停止ページ", "/issues/17", "この資料は現在公開されていません。");
    addResult(results, "更新履歴", "/updates", "『未明』第17号を非公開資料に移行しました。");
    addResult(results, "既刊一覧", "/issues", "公開版として登録された資料を参照できます。");
    return resultHtml(results);
  }

  if (has(q, ["9", "09", "9号", "第9号", "九号", "第九号", "未明9", "A-410-09", "A41009"])) {
    addResult(results, "『未明』第9号", "/issues/9", "第9号の公開版です。");
    addResult(results, "更新履歴", "/updates", "第9号の再登録履歴があります。");
  }

  if (has(q, ["23", "23号", "第23号", "二十三号", "第二十三号", "未明23", "A-410-23", "A41023"])) {
    addResult(results, "『未明』第23号", "/issues/23", "第23号の公開版です。");
    addResult(results, "更新履歴", "/updates", "第23号の再登録履歴があります。");
  }

  personSearch(q, results);
  titleSearch(q, results);
  issueSearch(q, results);

  if (has(q, ["部員", "部員記録", "部員一覧", "名簿", "メンバー", "所属", "在籍"])) {
    addResult(results, "部員記録", "/members", "年度別の公開部員記録です。");
  }

  if (has(q, ["退部", "除籍"])) {
    return `<p>該当する公開処理記録は見つかりませんでした。</p><p>候補：${link("/members", "部員記録")}</p>`;
  }

  if (has(q, ["資料室", "使い方", "検索方法", "照会", "資料照会", "mumei", "mimei", "archive", "archives", "未明資料室"])) {
    addResult(results, "資料室について", "/about", "資料室の掲載範囲を参照できます。");
    addResult(results, "既刊一覧", "/issues", "公開資料の管理番号を参照できます。");
    addResult(results, "資料番号について", "/material-numbers", "資料番号の基本的な区分を参照できます。");
  }

  if (["田中", "山田", "鈴木", "中村", "高橋", "架空太郎"].some((name) => q.includes(name))) {
    return `<p>該当する公開部員記録は見つかりませんでした。</p>`;
  }
  if (has(q, ["佐伯涼", "佐伯亮太"])) addResult(results, "佐伯亮の部員記録", "/members/saeki-ryo", "近い名前の記録があります。");
  if (has(q, ["三橋零"])) addResult(results, "三橋澪の部員記録", "/members/mihashi-mio", "近い名前の記録があります。");
  if (has(q, ["北村夏歩"])) addResult(results, "北村夏帆の部員記録", "/members/kitamura-kaho", "近い名前の記録があります。");

  if (["???", "TEST", "あああ", "111"].includes(normalize(q).normalized) || compact.length > 0 && /^[?A-Z0-9]+$/.test(compact) && !results.length && !id && !rid) {
    return `<p>該当する公開資料は見つかりませんでした。表記を変えて検索するか、既刊一覧をご参照ください。</p>${candidateLinks()}`;
  }

  return resultHtml(results);
}

function isA41017Query(q, id) {
  return id === "A-410-17" || has(q, ["A-410 第17号", "非公開資料 17", "非公開番号 17", "410 17"]);
}

function restrictedCard(managerId) {
  const result = managerId.trim() ? validateRestricted(managerId) : null;
  const form = `<form class="form-grid" action="/search" method="get"><input type="hidden" name="q" value="A-410-17"><label>照会ID<input name="managerId" value="${escapeHtml(managerId)}"></label><button type="submit">照会</button></form>`;
  const card = `<div class="note">${meta([["資料番号", "A-410-17"], ["資料名", "『未明』第17号"], ["状態", "非公開資料"], ["本文", "非公開"], ["目次", "非公開"]])}<p>この資料の表示には、発行時点の照会IDが必要です。</p>${form}</div>`;
  if (!result) return card;
  if (!result.ok) return `${card}<p>${escapeHtml(result.message)}</p>`;
  return restrictedIssueHtml();
}

function validateRestricted(managerId) {
  const rid = roleId(managerId);
  if (!managerId.trim()) return { ok: false, message: "必要項目が不足しています。" };
  if (rid === "PB-17-01") return { ok: true };
  if (rid === "PB-18-01") return { ok: false, message: "関連号数が一致しません。" };
  if (rid === "ED-17-02" || rid === "AC-17-04") return { ok: false, message: "この資料は発行責任者権限でのみ照会可能です。" };
  return { ok: false, message: "照会IDが一致しません。" };
}

function restrictedIssueHtml() {
  return `<section class="section"><p>照会を受理しました。<br>資料番号：A-410-17<br>『未明』第17号を表示します。</p>${meta([["発行日", restricted17.publicationDate], ["状態", restricted17.status]])}${section("目次", worksTable(restricted17.works))}${section("部員一覧", membersTable(restricted17.members))}${section("奥付", lines(restricted17.colophon))}${section("編集後記", `<p>${escapeHtml(restricted17.afterword)}</p>`)}<div class="note"><p>この資料には、非表示の本文記録があります。<br>本文記録の照会には編集責任者IDが必要です。</p></div></section>`;
}

function adminPage(url) {
  const q = url.searchParams.get("q") || "";
  const managerId = url.searchParams.get("managerId") || "";
  const shown = shouldSuppressQueryEcho(q) ? "" : q;
  const form = `<form class="form-grid" action="/admin" method="get"><label>照会番号を入力<input name="q" value="${escapeHtml(shown)}"></label><button type="submit">確認</button></form>`;
  const intro = `<p>このページは、資料管理用の照会ページです。<br>処理記録番号、部内通知番号、資料番号、照会IDを入力してください。</p><p>一般公開資料は、既刊一覧をご確認ください。</p>`;
  const result = q.trim() ? section("照会結果", adminLookupHtml(q, managerId)) : "";
  return page("管理用", `<h1>資料管理</h1>${intro}${form}${result}`, { noindex: true });
}

function adminLookupHtml(q, managerId = "") {
  const id = materialId(q);
  const mr = managementRecordId(q);
  const notice = internalNoticeId(q);
  const rid = roleId(q);
  if (mr) return managementRecordHtml(mr);
  if (notice) return internalNoticeHtml(notice);
  if (isA41017Query(q, id)) return adminRestrictedCard(managerId);
  if (rid || isExactTerm(q, ["照会ID", "発行時点の照会ID", "発行責任者ID", "役職コード", "PB", "ED", "AC"])) {
    return `<p>該当する公開資料は見つかりませんでした。<br>照会IDは、対象資料の照会画面で使用してください。</p>`;
  }
  return `<p>該当する管理記録は見つかりませんでした。</p>`;
}

function managementRecordHtml(id) {
  const notices = (items) => `<p>関連文書：</p><ul class="plain-list">${items.map((item) => `<li>${link(`/admin?q=${encodeURIComponent(item)}`, `部内通知 ${item}`)}</li>`).join("")}</ul>`;
  const records = {
    "MR-2012-0405": `<h2>資料管理記録：MR-2012-0405</h2>${meta([["対象資料", "『未明』公開資料全体"], ["処理区分", "公開資料登録開始"], ["処理理由", "公開資料の登録形式を整理するため。"], ["処理内容", "公開資料の資料番号、掲載情報、表示項目を登録しました。"]])}${notices(["2012-01"])}`,
    "MR-2016-0509": `<h2>資料管理記録：MR-2016-0509</h2>${meta([["対象資料", "『未明』第9号"], ["処理区分", "公開版再登録"], ["処理理由", "巻末掲載情報に、公開対象外の記載が含まれていたため。"], ["処理内容", "公開範囲を調整した公開版として再登録しました。"]])}${notices(["2012-02", "2012-03"])}`,
    "MR-2020-0612": `<h2>資料管理記録：MR-2020-0612</h2>${meta([["対象資料", "『未明』第17号"], ["処理区分", "公開停止"], ["処理理由", "公開範囲の再確認が必要となったため。"], ["処理内容", "公開資料一覧から除外しました。"]])}${notices(["2012-02"])}`,
    "MR-2023-0320": `<h2>資料管理記録：MR-2023-0320</h2>${meta([["対象資料", "『未明』第23号"], ["処理区分", "公開版再登録"], ["処理理由", "投稿者名の一部が、公開対象外情報に該当するため。"], ["処理内容", "投稿者名の一部を非表示にした公開版として再登録しました。"]])}${notices(["2012-02", "2012-03"])}`,
    "MR-2023-0430": `<h2>資料管理記録：MR-2023-0430</h2>${meta([["対象資料", "『未明』公開資料全体"], ["処理区分", "追加更新停止"], ["処理理由", "公開資料の整理作業が完了したため。"], ["処理内容", "当サイトにおける『未明』公開資料の追加更新を停止しました。"]])}${notices(["2012-05"])}`
  };
  return records[id] || `<p>該当する処理記録は見つかりませんでした。</p>`;
}

function internalNoticeHtml(id) {
  const notices = {
    "2012-01": `<h2>部内通知 2012-01</h2><h3>公開資料登録の基本について</h3><p>公開資料として登録する部誌は、資料番号 A-101 を付与して管理します。<br>公開資料の登録情報には、号数、発行日、目次、掲載者名を記録します。</p><p>公開資料の表示項目は、資料室で確認できる範囲に限定します。</p>`,
    "2012-02": `<h2>部内通知 2012-02</h2><h3>公開範囲と表示調整について</h3><p>公開資料に、公開対象外の記載が含まれる場合は、該当箇所を非表示にした公開版を作成します。</p><p>公開範囲の確認が完了するまで、対象資料を公開資料一覧から一時的に除外する場合があります。</p><p>表示調整を行った場合は、処理記録を更新履歴に残してください。</p>`,
    "2012-03": `<h2>部内通知 2012-03</h2><h3>公開版再登録資料の扱いについて</h3><p>一度非公開資料に移行した部誌を再公開する場合、公開版の管理番号には R を付与してください。</p><p>A-410は、非公開資料に移行した部誌本体を管理するための資料番号です。<br>再登録時には、通常公開版として A-101 に戻し、末尾に R を付与します。</p>${section("例", list(["『未明』第9号　A-410-09 → A-101-09R", "『未明』第23号　A-410-23 → A-101-23R"]))}<p>再登録後は、個人情報・投稿者名・奥付情報など、公開対象外となる箇所を非表示にしてください。</p>`,
    "2012-04": `<h2>部内通知 2012-04</h2><h3>制限資料の照会IDについて</h3><p>制限資料の照会IDは、役職コード・関連号数・発行時点の担当者番号で構成します。</p>${section("役職コード", list(["PB：発行責任者", "ED：編集責任者", "AC：会計担当"]))}<p>資料本体の照会には、原則として発行責任者IDを使用します。<br>編集記録の照会には、編集責任者IDを使用します。<br>会計記録の照会には、会計担当IDを使用します。</p><p>発行時点の担当者番号は、発行時点編集体制で確認してください。</p>${section("例", list(["PB-01-01", "ED-02-02"]))}`,
    "2012-05": `<h2>部内通知 2012-05</h2><h3>公開資料追加更新の停止について</h3><p>公開資料の整理作業が完了した場合、当サイトにおける公開資料の追加更新を停止できます。</p><p>追加更新の停止後も、既存の公開資料、更新履歴、処理記録は確認できます。</p>`
  };
  return notices[id] || `<p>該当する部内通知は見つかりませんでした。</p>`;
}

function adminRestrictedCard(managerId) {
  const result = managerId.trim() ? validateRestricted(managerId) : null;
  const form = `<form class="form-grid" action="/admin" method="get"><input type="hidden" name="q" value="A-410-17"><label>照会IDを入力してください<input name="managerId" value="${escapeHtml(managerId)}"></label><button type="submit">確認</button></form>`;
  const card = `<div class="note">${meta([["資料番号", "A-410-17"], ["資料名", "『未明』第17号"], ["状態", "非公開資料"], ["本文", "非公開"], ["目次", "非公開"]])}<p>この資料の表示には、発行時点の照会IDが必要です。</p>${form}</div>`;
  if (!result) return card;
  if (!result.ok) return `${card}<p>${escapeHtml(result.message)}</p>`;
  return restrictedIssueHtml();
}

function personSearch(q, results) {
  const map = [
    ["朝倉仁", "asakura-jin", ["朝倉仁", "朝倉", "あさくら", "asakura", "asakura jin", "jin asakura"]],
    ["小野瑞希", "ono-mizuki", ["小野瑞希", "小野", "瑞希", "おの", "みずき", "ono", "mizuki", "ono mizuki"]],
    ["宮沢灯", "miyazawa-akari", ["宮沢灯", "宮沢", "灯", "みやざわ", "あかり", "miyazawa", "akari", "miyazawa akari"]],
    ["平井直人", "hirai-naoto", ["平井直人", "平井", "直人", "ひらい", "なおと", "hirai", "naoto", "hirai naoto"]],
    ["杉原芽衣", "sugihara-mei", ["杉原芽衣", "杉原", "芽衣", "すぎはら", "めい", "sugihara", "mei", "sugihara mei"]],
    ["川瀬航", "kawase-wataru", ["川瀬航", "川瀬", "航", "かわせ", "わたる", "kawase", "wataru", "kawase wataru"]],
    ["南野拓", "minamino-taku", ["南野拓", "南野", "拓", "みなみの", "たく", "minamino", "taku", "minamino taku"]],
    ["藤野圭", "fujino-kei", ["藤野圭", "藤野", "圭", "ふじの", "けい", "fujino", "kei", "fujino kei"]],
    ["長谷川莉奈", "hasegawa-rina", ["長谷川莉奈", "長谷川", "莉奈", "はせがわ", "りな", "hasegawa", "rina", "hasegawa rina"]],
    ["瀬尾千尋", "seo-chihiro", ["瀬尾千尋", "瀬尾", "千尋", "せお", "ちひろ", "seo", "chihiro", "seo chihiro"]],
    ["工藤真由", "kudo-mayu", ["工藤真由", "工藤", "真由", "くどう", "まゆ", "kudo", "mayu", "kudo mayu"]],
    ["宮原葵", "miyahara-aoi", ["宮原葵", "宮原", "葵", "みやはら", "あおい", "miyahara", "aoi", "miyahara aoi"]],
    ["石田航", "ishida-wataru", ["石田航", "石田", "航", "いしだ", "わたる", "ishida", "wataru", "ishida wataru"]],
    ["佐伯亮", "saeki-ryo", ["佐伯亮", "佐伯", "さえき", "サエキ", "saeki", "ryo saeki", "saeki ryo", "佐伯さん", "佐伯亮さん"]],
    ["北村夏帆", "kitamura-kaho", ["北村夏帆", "北村", "きたむら", "キタムラ", "kitamura", "北村夏歩"]],
    ["三橋澪", "mihashi-mio", ["三橋澪", "三橋", "澪", "みはし", "ミハシ", "mihashi", "mio", "mihashi mio", "三橋さん", "三箸", "三橋零"]],
    ["森下遼", "morishita-ryo", ["森下遼", "森下", "もりした", "モリシタ", "morishita"]],
    ["相沢悠", "aizawa-yu", ["相沢悠", "相沢", "あいざわ", "アイザワ", "aizawa"]],
    ["榎本紗良", "enomoto-sara", ["榎本紗良", "榎本", "enomoto", "sara"]],
    ["白井陸", "shirai-riku", ["白井陸", "白井", "shirai", "riku"]],
    ["高瀬真琴", "takase-makoto", ["高瀬真琴", "高瀬", "takase", "makoto"]],
    ["小野寺柊", "onodera-shu", ["小野寺柊", "小野寺", "onodera", "shu"]]
  ];
  for (const [name, slug, terms] of map) {
    if (!has(q, terms)) continue;
    const profile = profileRecords[slug];
    addResult(results, `${name}の部員記録`, `/members/${slug}`, "公開部員記録と関連公開資料を参照できます。");
    for (const issueNumber of profile?.related || []) {
      const issue = issueData.find((item) => item.number === issueNumber);
      if (!issue) continue;
      const works = issue.works.filter((w) => w.author === name).map((w) => `「${w.title}」`).join("、");
      const excerpt = works ? `${name}${works}掲載` : "関連公開資料です。";
      addResult(results, `『未明』第${issue.number}号`, `/issues/${issue.number}`, excerpt);
    }
    if (name === "三橋澪") {
      addResult(results, "部員記録一覧", "/members", "年度別の公開部員記録です。");
      addResult(results, "2020年秋以降の公開部員記録には該当記録がありません。", "", "公開部員記録上の照合結果です。");
    }
    break;
  }
}

function titleSearch(q, results) {
  const hiddenTitle = ["午前二時のコピー機", "午前2時のコピー機", "午前二時", "午前2時", "コピー機", "二時のコピー機", "ごぜんにじのコピー機", "二時", "午前"];
  if (has(q, hiddenTitle)) return;
  const query = normalize(q);
  const exactMatches = [];
  for (const issue of issueData) {
    for (const w of issue.works) {
      const title = normalize(w.title);
      if (query.normalized === title.normalized || query.compact === title.compact) exactMatches.push([issue, w]);
    }
  }
  const source = exactMatches.length ? exactMatches : issueData.flatMap((issue) => issue.works.map((w) => [issue, w]).filter(([, w]) => {
    const title = normalize(w.title);
    return query.normalized.includes(title.normalized) || title.normalized.includes(query.normalized) || query.compact.includes(title.compact) || title.compact.includes(query.compact);
  }));
  for (const [issue, w] of source) {
    addResult(results, `『未明』第${issue.number}号`, `/issues/${issue.number}`, `${w.author}「${w.title}」掲載`);
    }
}

function issueSearch(q, results) {
  const id = materialId(q);
  const c = normalize(q).compact;
  for (const issue of issueData) {
    const n = String(issue.number);
    const z = n.padStart(2, "0");
    const terms = [
      n,
      z,
      `${n}号`,
      `第${n}号`,
      `未明${n}`,
      `未明第${n}号`,
      issue.materialId.replaceAll("-", "")
    ];
    if (id === issue.materialId || terms.includes(c)) addResult(results, `『未明』第${issue.number}号`, `/issues/${issue.number}`, `${issue.materialId} として登録されています。`);
  }
  const n = Number((normalize(q).compact.match(/\d+/) || [])[0]);
  if ([24, 25, 99, 0, 100].includes(n)) {
    addResult(results, "既刊一覧", "/issues", "現在公開されている資料をご参照ください。");
    addResult(results, "更新履歴", "/updates", "登録履歴をご参照ください。");
  }
}

function homePage() {
  return page("トップ", `<h1>未明文芸会資料室</h1><p class="lead">未明文芸会資料室は、文芸部誌『未明』の公開版および関連する部員記録を保存するための私設アーカイブです。<br>公開資料は、原則として既刊一覧に登録されたものに限ります。<br>公開範囲を変更した資料については、更新履歴に記録しています。</p>`);
}

function aboutPage() {
  return page("資料室について", `<h1>資料室について</h1><p>未明文芸会資料室は、文芸部誌『未明』の公開版および関連する部員記録を保存するための私設アーカイブです。</p><p>公開資料は、原則として既刊一覧に登録されたものに限ります。公開範囲を変更した資料については、更新履歴に記録しています。</p>`);
}

function materialNumbersPage() {
  return page("資料番号について", `<h1>資料番号について</h1><p>本資料室では、公開中の部誌資料を資料番号で管理しています。</p><p>A-101 は、通常公開されている部誌本体に付与される番号です。</p>${section("例", list(["A-101-01　『未明』第1号", "A-101-02　『未明』第2号"]))}<p>末尾に R が付く資料は、登録情報が更新された公開版です。</p>${section("形式例", list(["A-101-01R", "A-101-02R"]))}<p>資料番号が分かっている場合は、資料室内検索に入力してください。</p><p>資料番号の付与・更新に関する処理は、更新履歴の処理記録に記載しています。</p>`, { noindex: true });
}

function issuesPage() {
  const rows = issueData.map((i) => [link(`/issues/${i.number}`, `第${i.number}号`), escapeHtml(i.season), escapeHtml(i.materialId)]);
  return page("既刊一覧", `<h1>既刊一覧</h1>${table(["号数", "発行時期", "資料番号"], rows)}`);
}

function issuePage(number) {
  if (number === 17) return page("『未明』第17号", `<h1>『未明』第17号</h1><p>この資料は現在公開されていません。<br>公開停止資料の照会は、資料番号で検索してください。</p>`, { noindex: true });
  const issue = issueData.find((i) => i.number === number);
  if (!issue) return issueNotFoundPage();
  const note = issue.note.length ? section("注記", list(issue.note)) : "";
  return page(`『未明』第${issue.number}号`, `<h1>『未明』第${issue.number}号</h1>${meta([["発行日", escapeHtml(issue.date)], ["資料番号", escapeHtml(issue.materialId)], ["状態", escapeHtml(issue.status)]])}${section("目次", worksTable(issue.works))}${section("部員一覧", membersTable(issue.members))}${section("奥付", lines(issue.colophon))}${note}${section("編集後記", `<p>${escapeHtml(issue.afterword)}</p>`)}`);
}

function updatesPage() {
  return page("更新履歴", `<h1>更新履歴</h1>${list(updateLines)}`);
}

function membersPage() {
  const body = `<h1>部員記録</h1><p class="lead">公開資料から参照できる年度別の部員記録です。</p><p>本資料室における担当者番号は、各年度の編集体制ごとに付与された管理番号です。</p>${memberRecords.map(([term, rows]) => section(term, table(["氏名", "担当者番号", "役職"], rows.map((line) => {
    const [name, no, ...role] = line.split(" ");
    const slug = Object.entries(people).find(([, p]) => p.name === name)?.[0];
    return [slug ? link(`/members/${slug}`, name) : escapeHtml(name), escapeHtml(no), escapeHtml(role.join(" "))];
  })))).join("")}`;
  return page("部員記録", body);
}

function memberPage(slug) {
  const person = people[slug];
  if (!person) return genericNotFoundPage();
  const profile = profileRecords[slug];
  if (!profile) return genericNotFoundPage();
  const related = profile.related.map((number) => link(`/issues/${number}`, `第${number}号`)).join("、") || "該当公開資料なし";
  const rows = [
    ["担当者番号", escapeHtml(profile.no)],
    ["主な役職", escapeHtml(profile.role || "部員")],
    ["公開部員記録", escapeHtml(profile.publicRecord)],
    ["関連公開資料", related]
  ];
  if (profile.graduation) rows.push(["卒業記録", escapeHtml(profile.graduation)]);
  const works = profile.works ? section("掲載作品", list(profile.works)) : "";
  const post = profile.post ? section("卒業後記録", list(profile.post)) : "";
  const note = profile.note ? section("注記", `<p>${escapeHtml(profile.note)}</p>`) : "";
  return page(person.name, `<h1>${escapeHtml(person.name)}</h1>${meta(rows)}${works}${post}${note}`);
}

function graduatesPage() {
  return page("卒業生記録", `<h1>卒業生記録</h1>${graduateRecords.map(([term, names]) => section(term, list(names))).join("")}`, { noindex: true });
}

function editorialPage() {
  return page("発行時点編集体制", `<h1>発行時点編集体制</h1>${editorialRecords.map(([term, rows]) => section(term, list(rows))).join("")}`, { noindex: true });
}

function reRegistrationNotice() {
  return page("部員向け通知：公開版再登録資料の扱いについて", `<h1>部員向け通知：公開版再登録資料の扱いについて</h1><p>一度非公開資料に移行した部誌を再公開する場合、公開版の管理番号には R を付与してください。</p><p>A-410は、非公開資料に移行した部誌本体を管理するための資料番号です。<br>再登録時には、通常公開版として A-101 に戻し、末尾に R を付与します。</p>${section("例", list(["『未明』第9号　A-410-09 → A-101-09R", "『未明』第23号　A-410-23 → A-101-23R"]))}<p>再登録後は、個人情報・投稿者名・奥付情報など、公開対象外となる箇所を非表示にしてください。</p>`);
}

function restrictedNotice() {
  return page("部員向け通知：制限資料の照会権限について", `<h1>部員向け通知：制限資料の照会権限について</h1><p>公開停止資料および再分類前資料の照会には、発行時点の照会IDを使用してください。<br>照会IDは、役職コード・関連号数・担当者番号で構成します。</p>${section("役職コード", list(["PB：発行責任者", "ED：編集責任者", "AC：会計担当"]))}${section("例", list(["PB-09-01", "ED-13-02"]))}<p>資料本体の照会には、原則として発行責任者IDを使用してください。<br>編集履歴の照会には、編集責任者IDを使用してください。</p>`);
}

function accessIdPage() {
  return page("照会IDについて", `<h1>照会IDについて</h1><p>本資料室では、一部資料の表示に照会IDを使用しています。</p><p>照会IDは、役職コード・関連号数・発行時点の担当者番号で構成します。</p>${section("役職コード", list(["PB：発行責任者", "ED：編集責任者", "AC：会計担当"]))}${section("例", list(["PB-09-01", "ED-13-02"]))}<p>資料本体の照会には、原則として発行責任者IDを使用します。<br>発行時点の担当者は、年度別編集体制で参照してください。</p>`);
}

function noticesPage() {
  const noticeLinks = (items) => `<ul class="plain-list">${items.map(([href, label]) => `<li>${link(href, label)}</li>`).join("")}</ul>`;
  return page("部員向け通知一覧", `<h1>部員向け通知一覧</h1>${section("資料番号・目録関係", noticeLinks([["/notices/public-labels", "公開資料の表記更新について"], ["/notices/catalog-redactions", "目録掲載情報の非表示処理について"], ["/notices/re-registration", "公開版再登録資料の扱いについて"]]))}${section("照会ID関係", noticeLinks([["/notices/restricted-access", "制限資料の照会権限について"]]))}${section("部員記録関係", noticeLinks([["/notices/member-record-scope", "部員記録の公開範囲について"]]))}`);
}

function simpleNoticePage(title, body) {
  return page(`部員向け通知：${title}`, `<h1>部員向け通知：${escapeHtml(title)}</h1>${body}`);
}

function publicLabelsNotice() {
  return simpleNoticePage("公開資料の表記更新について", `<p>公開資料の表記を更新した場合は、更新日と対象資料を更新履歴に記録してください。</p><p>表記の変更は、公開中の資料と既刊一覧の整合を参照したうえで行ってください。</p>`);
}

function catalogRedactionsNotice() {
  return simpleNoticePage("目録掲載情報の非表示処理について", `<p>目録に掲載する情報の一部を非表示とする場合は、対象箇所と処理理由を内部記録に残してください。</p><p>公開画面では、必要最小限の注記のみを付してください。</p>`);
}

function memberRecordScopeNotice() {
  return simpleNoticePage("部員記録の公開範囲について", `<p>部員記録は、公開資料から参照できる範囲を原則として掲載します。</p><p>参照できない在籍情報や処理記録は、公開画面に推測として記載しないでください。</p>`);
}

function genericNotFoundPage() {
  return page("公開資料未登録", `<h1>指定された公開資料は見つかりませんでした。</h1><p>入力されたURLまたは資料番号に対応する公開資料は、現在の既刊一覧には登録されていません。<br>資料名・号数・資料番号が分かる場合は、資料室内検索を利用してください。</p><p>候補：${link("/issues", "既刊一覧")} ／ ${link("/updates", "更新履歴")} ／ ${link("/search", "資料室内検索")}</p>`, { noindex: true });
}

function issueNotFoundPage() {
  return page("公開資料未登録", `<h1>指定された号の公開資料は見つかりませんでした。</h1><p>現在公開されている資料は、既刊一覧をご参照ください。</p><p>${link("/issues", "既刊一覧")}</p>`, { noindex: true });
}

function materialUrlNotFoundPage() {
  return page("公開資料未登録", `<h1>指定された公開資料は見つかりませんでした。</h1><p>資料番号はURLではなく、資料室内検索または管理用ページから照会してください。</p><p>候補：${link("/issues", "既刊一覧")} ／ ${link("/updates", "更新履歴")} ／ ${link("/search", "資料室内検索")}</p>`, { noindex: true });
}

function render(path, url) {
  if (path === "/") return homePage();
  if (path === "/about") return aboutPage();
  if (path === "/material-numbers") return materialNumbersPage();
  if (path === "/admin" || path === "/manage") return adminPage(url);
  if (path === "/issues") return issuesPage();
  if (path.startsWith("/issues/")) {
    const part = path.split("/").pop() || "";
    if (materialId(part)) return materialUrlNotFoundPage();
    return issuePage(Number(part));
  }
  if (path === "/updates") return updatesPage();
  if (path === "/members") return membersPage();
  if (path.startsWith("/members/")) return memberPage(path.split("/").pop());
  if (path === "/graduates") return graduatesPage();
  if (path === "/editorial-structure" || path === "/roles") return editorialPage();
  if (path === "/search") return searchPage(url);
  if (path === "/lookup" || path === "/restricted" || path === "/access-id" || path.startsWith("/notices")) return genericNotFoundPage();
  if (path === "/report" || path === "/report/thanks") return genericNotFoundPage();
  if (materialId(path.replaceAll("/", ""))) return materialUrlNotFoundPage();
  return genericNotFoundPage();
}

function sitemapXml(origin) {
  const paths = ["/", "/about", "/issues", "/updates", "/members", "/search"];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${escapeHtml(origin + path)}</loc></url>`).join("\n")}\n</urlset>\n`;
}

function robotsTxt(origin) {
  return `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (request.method === "GET" && url.pathname === "/robots.txt") {
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(robotsTxt(url.origin));
    return;
  }
  if (request.method === "GET" && url.pathname === "/sitemap.xml") {
    response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8" });
    response.end(sitemapXml(url.origin));
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/restricted") {
    let raw = "";
    request.on("data", (chunk) => (raw += chunk));
    request.on("end", () => {
      let body = {};
      try { body = JSON.parse(raw || "{}"); } catch {}
      const mat = materialId(body.materialId || "");
      const result = mat === "A-410-17" ? validateRestricted(String(body.managerId || "")) : { ok: false, message: "資料番号が一致しません。" };
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ ...result, html: result.ok ? restrictedIssueHtml() : `<p>${escapeHtml(result.message)}</p>` }));
    });
    return;
  }
  if (request.method !== "GET") {
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method Not Allowed");
    return;
  }
  const body = render(url.pathname, url);
  const status = body.includes("指定された公開資料は見つかりませんでした") || body.includes("指定された号の公開資料は見つかりませんでした") ? 404 : 200;
  response.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  response.end(body);
});

server.listen(port, host);
﻿

