"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewStage = exports.ApplicationStatus = exports.ApplicationSource = exports.EmployeeType = exports.EmploymentType = exports.CareerPostingStatus = exports.StatusEnum = exports.CivilStatus = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (exports.Gender = Gender = {}));
var CivilStatus;
(function (CivilStatus) {
    CivilStatus["SINGLE"] = "single";
    CivilStatus["MARRIED"] = "married";
    CivilStatus["SEPARATED"] = "separated";
    CivilStatus["WIDOWED"] = "widowed";
})(CivilStatus || (exports.CivilStatus = CivilStatus = {}));
var StatusEnum;
(function (StatusEnum) {
    StatusEnum["ACTIVE"] = "active";
    StatusEnum["INACTIVE"] = "inactive";
})(StatusEnum || (exports.StatusEnum = StatusEnum = {}));
var CareerPostingStatus;
(function (CareerPostingStatus) {
    CareerPostingStatus["ALL"] = "all";
    CareerPostingStatus["DRAFT"] = "draft";
    CareerPostingStatus["SUBMITTED"] = "submitted";
    CareerPostingStatus["VERIFIED"] = "verified";
    CareerPostingStatus["APPROVED"] = "approved";
    CareerPostingStatus["REJECTED"] = "rejected";
})(CareerPostingStatus || (exports.CareerPostingStatus = CareerPostingStatus = {}));
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "full_time";
    EmploymentType["PART_TIME"] = "part_time";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
var EmployeeType;
(function (EmployeeType) {
    EmployeeType["LAND_BASED"] = "land_based";
    EmployeeType["SEA_BASED"] = "sea_based";
})(EmployeeType || (exports.EmployeeType = EmployeeType = {}));
var ApplicationSource;
(function (ApplicationSource) {
    ApplicationSource["COMPANY_WEBSITE"] = "company_website";
    ApplicationSource["WALK_IN"] = "walk_in";
    ApplicationSource["REFERRAL"] = "referral";
    ApplicationSource["LINKEDIN"] = "linkedIn";
    ApplicationSource["JOBSTREET"] = "jobstreet";
})(ApplicationSource || (exports.ApplicationSource = ApplicationSource = {}));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["APPLIED"] = "applied";
    ApplicationStatus["SCREENING"] = "screening";
    ApplicationStatus["FOR_INTERVIEW"] = "for_interview";
    ApplicationStatus["ACCEPTED"] = "accepted";
    ApplicationStatus["REJECTED"] = "rejected";
    ApplicationStatus["ONBOARDING"] = "onboarding";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var InterviewStage;
(function (InterviewStage) {
    InterviewStage["INITIAL"] = "initial";
    InterviewStage["SECOND"] = "second";
    InterviewStage["FINAL"] = "final";
})(InterviewStage || (exports.InterviewStage = InterviewStage = {}));
//# sourceMappingURL=global.enums.decorator.js.map