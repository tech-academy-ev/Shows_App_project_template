class Show {
    constructor(language, name, mainGenre, image, officialUrl, showStartDate,
        showEndDate, summary, tvMazeUrl, cableNetwork, webChannel) {
        this.language=language,
        this.name=name,
        this.mainGenre=mainGenre,
        this.image=image,
        this.officialUrl=officialUrl,
        this.showStartDate=showStartDate,
        this.showEndDate=showEndDate,
        this.summary=summary,
        this.tvMazeUrl=tvMazeUrl,
        this.cableNetwork=cableNetwork,
        this.webChannel=webChannel
    }

    getName() {
        return this.name;
    }

    getLanguage() {
        return this.language;
    }

    getMainGenre() {
        return this.mainGenre;
    }

    getImage() {
        return this.image;
    }

    getWebsiteUrl() {
        return this.officialUrl ? this.officialUrl : this.tvMazeUrl;
    }

    getShowStartDate() {
        return this.showEndDate;
    }

    getShowEndDate() {
        return this.showEndDate;
    }

    hasShowEnded() {
        return true ? this.showEndDate : false;
    }

    getSummary() {
        return this.summary;
    }

    getNetwork() {
        return this.cableNetwork ? this.cableNetwork : this.webChannel;
    }
}