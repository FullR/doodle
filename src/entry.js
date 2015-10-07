import docReady from "doc-ready";
require("./index.html");
require("./style/base.scss");

docReady(() => require("app"));
