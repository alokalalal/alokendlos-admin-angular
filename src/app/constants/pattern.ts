export class Pattern {
    public static email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public static mobile = /^(?=.{10,10}$)[0-9]\d*$/;
    public static spaceNotAllowed = /^\S*$/;
    public static alphaWithSpace= /^[a-z\s]+$/i;
    public static alphaWithSpaceDot= /^[a-z\s.]+$/i;
    public static alphaNumeric= /^[a-z\d]+$/i;
    public static onlyNumeric= /^[\d]+$/i;
    public static onlyNumericWithNegative= /^-?(0|[1-9]\d*)?$/;
    public static alphaNumericWithSpace= /^[a-z\d\s]+$/i;
    public static alphaNumericWithSpaceHypen= /^[a-z\d\s-]+$/i;
    public static alphaNumericWithSpaceDot= /^[a-z\d\s.]+$/i;
    public static alphaNumericWithSpaceDotAndHypen= /^[a-z\d\s.&-]+$/i;
    public static youtubeLink = /^http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    public static url = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    public static onlyFloatNumber = /^-?\d*\.?\d*$/;
    public static website = '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$';
    public static startingAlphaOnlyAlphaNumericUnderScorePattern = /^[a-z][a-z-0-9]*$/
}