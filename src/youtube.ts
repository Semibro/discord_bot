const youtubeSearchApi = require("youtube-search-api");

export const searchYoutube = async (searchKeyword: string) => {
    try {
        const searchResult = await youtubeSearchApi.GetListByKeyword(searchKeyword);
        console.log(`===== YOUTUBE RESPONSE =====\n${JSON.stringify(searchResult, null, 2)}`);

        for (const item of searchResult.items) {
            if (item.type === "video") {
                return `https://www.youtube.com/watch?v=${item.id}`;
            }
        }

        return "검색 결과가 없습니다."

    } catch (e) {
        console.log("검색 에러", e);
        return "검색에 실패했습니다.\n제대로 된 검색어를 입력해주세요!!";
    }
};