(function ($, window, undefined) {
    //const
    var CLASS_BLOCK = "object", CLASS_SELECTED = "selected", CLASS_CURSORED = "cursored";
    var CSS_TABLE = "table table-bordered";
    var PLUGIN_NAME = "block", document = window.document;
    var STR = "string";
    var JSON_SERVLET_URL = "http://df049m-v64:7001/RtServer/sql2json";

    function Plugin(element, options) {
        this.element = element;
        this.columnNames = options["columnNames"];
        this.columnKeys = options["columnKeys"];
        this.columnWidths = options["columnWidths"];
        this.displayRows = options["displayRows"];
        this.relations = options["relations"];
        this.sql = options["sql"];
        this.rows = [];
        this.init();
    }

    Plugin.prototype.init = function () {
        var $elem = $(this.element);
        $elem.addClass(CLASS_BLOCK);
        //this.refreshData();
    }
    Plugin.prototype.setData = function (data) {
        _this = this;
        _this.rows=[];
        $.each(data, function(index, row) {
            _this.rows.push(row);
        });
    }
    //
    Plugin.prototype.refreshData = function () {
        $(_this.element).empty();
        loadTitle(_this, _this.columnNames);
        loadRows(_this, _this.rows);
    }

    //加载标题行
    var loadTitle = function (block, columnNames) {
        table = $("<table><thead></thead><tbody></tbody></table>");
        table.addClass(CSS_TABLE);
        thead = table.find("thead");
        headerRow = $("<tr>").appendTo(thead);
        tbody = table.find("tbody");
        $.each(columnNames, function (index, columnName) {
            headerCell = $("<td>");
            headerCell.html(columnName);
            headerRow.append(headerCell);
        });
        $(block.element).append(table);
    }

    //加载内容行
    var loadRows = function (block, rows) {
        var domTable = block.element;
        var tbody = $(domTable).find("tbody");
        tbody.empty();
        $.each(rows, function (index, row) {
            console.log("load:" + row);
            var tr = $('<tr>');
            $.each(block.columnKeys, function (index, propertyName) {
                var td = $('<td>');
                td.html(row[propertyName.toUpperCase()]);
                tr.append(td);
            });
            tr.on("click", block.onRowSelected);
            tr.each(function () {
                $.data(this, "row-data", row);
            });
            tbody.append(tr);
            if (block.displayRows == (index + 1)) { return false; }
        });
    }


    //
    Plugin.prototype.onRowSelected = function (e) {
        var rowData = $.data(this, "row-data");
        $block = $(this).parents(".block");
        var block;
        $block.each(function () {
            block = $.data(this, PLUGIN_NAME);
        });

        $.each(block.relations, function (index, relation) {
            var childBlockName = relation["childBlock"];
            var filterColumns = relation["filterColumns"];
            childBlock = $("#" + childBlockName).data(PLUGIN_NAME);
            var sql = "Select * From (" + childBlock.sql + ") Where ";
            var condition = "";
            $.each(filterColumns, function (index, filterColumn) {
                condition += filterColumn + "='" + rowData[filterColumn.toUpperCase()] + "' And ";
            });
            childBlock.sql = sql + condition + "1=1";
            childBlock.refreshData();
        });
    }

    $.fn[PLUGIN_NAME] = function (options, command) {
        if (typeof options === STR) {
            command = options;
            options = undefined;
        }

        return this.each(function () {
            $.data(this, PLUGIN_NAME, new Plugin(this, options));
        });
    };

}(jQuery, window));