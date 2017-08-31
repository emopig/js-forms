(function ($, window, undefined) {
    //const
    var CLASS_BLOCK = "object", CLASS_SELECTED = "selected", CLASS_CURSORED = "cursored";
    var CSS_TABLE = "table table-bordered";
    var PLUGIN_NAME = "searchbar", document = window.document;
    var STR = "string";

    function Plugin(element, options) {
        this.element = element;
        this.url = options["url"];
        this.resultListId = options["resultListId"];
        this.btnText = options["btnText"];
        _this = this;
        this.init();
        
    }

    Plugin.prototype.init = function() {
        input = $('<input type="text"/>');
        input.on({
            mouseenter:function(){},
            mouseleave:function(){}
        });
        input.html(this.initText);
        button = $('<button>');
        button.html(this.btnText);
        button.on({
            click:function(){
                blkResultList = $("#"+_this.resultListId).data("block");
                blkResultList.setData();
                blkResultList.resultData();
            }
        });
        $(this.element).append(input);
        $(this.element).append(button);
    }
    //

    Plugin.prototype.onSearch = function(e){
        blkResultList = $("#"+this.resultListId).data("object");
        _this = this;
        $.get(this.url, function (data) {
            this.resultData = data;
            });
        blkResultList.setData(this.resultData);
        blkResultList.refresh();
    }


    $.fn[PLUGIN_NAME] = function (options, command) {
        if (typeof options === STR) {
            command = options;
            options = undefined;
        }

        return this.each(function () {
            $.data(this, "object", new Plugin(this, options));
        });
    };

} (jQuery, window));