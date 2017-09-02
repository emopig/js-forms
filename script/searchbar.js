(function ($, window, undefined) {
    //const
    var CLASS_BLOCK = "object", CLASS_SELECTED = "selected", CLASS_CURSORED = "cursored";
    var CSS_TABLE = "table table-bordered";
    var PLUGIN_NAME = "searchbar", document = window.document;
    var STR = "string";

    function Plugin(element, options) {
        this.element = element;
        this.baseUrl = options["baseUrl"];
        this.resultListId = options["resultListId"];
        this.btnText = options["btnText"];
        this.pageSize = options["pageSize"];
        this.init();
    }

    Plugin.prototype.init = function () {
        var _this = this;
        
        input = $('<input type="text"/>');
        input.on({
            mouseenter: function () { },
            mouseleave: function () { }
        });
        input.html(this.initText);
        button = $('<button>');
        button.html(this.btnText);
        button.on({
            click: function () {
                var blkResultList = $("#" + _this.resultListId).data("block");
                var keywords = $(_this.element).find("input").val();
                var from = 1, to = 10;
                var jsonUrl = _this.baseUrl + "?keywords=" + keywords + "&from=" + from + "&to=" + to;
                $.get(jsonUrl, function (data) { 
                    blkResultList.setData(data);
                    blkResultList.refreshData();
                })
            }
        });
        $(this.element).append(input);
        $(this.element).append(button);
    }
    //

    $.fn[PLUGIN_NAME] = function (options, command) {
        if (typeof options === STR) {
            command = options;
            options = undefined;
        }

        return this.each(function () {
            $.data(this, "object", new Plugin(this, options));
        });
    };

}(jQuery, window));