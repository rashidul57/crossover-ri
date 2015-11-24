angular.module('templates-dist', ['templates/grid.html']);

angular.module("templates/grid.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/grid.html",
    "<div ng-if=\"rows.length > 0\" class=\"container-fluid grid\"><div class=\"row header\"><div class=\"col-lg-1 col-md-1 col-sm-1 col-xs-1 first-col\"><div class=left-color-mark></div><div>Changelist</div></div><div class=\"col-lg-1 col-md-1 col-sm-1 col-xs-1\">Owner</div><div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2\">Time Started</div><div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2\">Build</div><div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2\">Unit Test</div><div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2\">Functional Test</div><div class=\"col-lg-1 col-md-2 col-sm-1 col-xs-1\">Status</div></div><div class=\"row {{ rec.status }} anim\" ng-class=\"{detail: rec.detail==true, master: rec.master== true}\" ng-repeat=\"rec in rows\" ng-click=expandRow(rec)><div ng-if=!rec.detail class=\"col-lg-1 col-md-1 col-sm-1 col-xs-1 first-col\"><div class=left-color-mark></div><div>{{rec.changeList}}</div></div><div ng-if=!rec.detail class=\"col-lg-1 col-md-1 col-sm-1 col-xs-1 owner\">{{rec.owner}}</div><div ng-if=!rec.detail class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2 datetime\"><span>{{rec.date}}</span><span class=time>{{rec.time}}</span></div><div ng-if=!rec.detail class=\"col-lg-6 col-md-6 col-sm-6 col-xs-6 build-to-test\" build-to-test=\"{{ rec.status }}\" level={{rec.level}}></div><div ng-if=\"!rec.master && !rec.detail\" class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2 last-col\"><div class=status>{{rec.status}}</div></div><div ng-if=rec.detail class=\"col-lg-10 col-md-10 col-sm-10 col-xs-10 first-col\" height=109 detail-steps><div class=left-color-mark></div></div><div ng-if=rec.detail class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2 last-col\"><div class=\"detail-status {{ rec.status }}\" height=176 status-summary></div></div></div></div><div ng-if=\"rows.length === 0\" class=empty-grid>No Data found</div>");
}]);
