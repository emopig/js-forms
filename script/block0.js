(function ($) {
    $.fn.block = function (options) {
        var templates = $.extend({
            // html 模板
            tableTemplate: '<table><thead></thead><tbody></tbody></table>',
            headerTemplate: '<th width="{{width}}">{{title}}</th>',
        }, options.templates);

        var settings = $.extend({
            //默认设置
            servletUrl: "http://df049m:7001/RtServer/sql2json",
            pageSize: 500,
            columnWidths: [],
            cellTemplates: null,
            tableClass: "table"
        }, options);

        settings.templates = templates;

        return this.each(function () {
            var table;
            var tbody;
            var thead;
            var headerRow;
            var headerCell;
            var data;
            var childBlock;
            var relationKeys;
            var currentPage = 0;
            var selectedRow = null;
            //var rowNo = 0;
            var $this = $(this);


            if (settings.hasOwnProperty("childBlock")) {
                childBlock = settings.childBlock;
            }

            if (settings.hasOwnProperty("relationKeys")) {
                relationKeys = settings.relationKeys;
            }

            var jsonUrl = settings.servletUrl + "?sql=" + settings.sql;

            $.getJSON(jsonUrl, function (_data) {
                data = _data;
            });

            //
            table = $(settings.templates.tableTemplate);
            thead = table.find("thead");
            headerRow = $("<tr>").appendTo(thead);
            tbody = table.find("tbody");
            table.addClass(settings.tableClass);

            //标题行
            $.each(settings.columnNames, function (index, columnName) {
                var columnKey = settings.columnKeys[index];
                var width;
                width = settings.columnWidths.length > index ? settings.columnWidths[index] : "";
                headerCell = $(Mustache.render(settings.templates.headerTemplate, { width: width, title: columnName }));
                headerRow.append(headerCell);
            });
            //内容行
            tbody.empty();
            $.getJSON(jsonUrl, function (data) {
                $.each(data, function (rowIndex, rowData) {
                    var tr = $('<tr>');
                    tr.attr("whl_no", rowData["WHL_NO"] + 1);
                    $.each(settings.columnKeys, function (index, propertyName) {
                        var td = $('<td>');
                        if (settings.cellTemplates !== null && index < settings.cellTemplates.length && settings.cellTemplates[index] !== null) {
                            td.html(Mustache.render(settings.cellTemplates[index], rowData));
                        }
                        else {
                            td.html(rowData[propertyName.toUpperCase()]);
                        }
                        tr.append(td);
                    });
                    //默认选中行为第1行
                    if (selectedRow === null) { selectedRow = tr };
                    //行点击时
                    tr.click(function (event) {
                        event.preventDefault();
                        //tr.find()
                        //alert(tr.attr("whl_no") + '行被选中');
                        selectedRow.removeClass("selected");
                        selectedRow = tr;
                        selectedRow.addClass("selected");
                        if (childBlock !== null) {
                            var child = $("#" + childBlock);
                            child.empty();
                            child.block({
                                "columnKeys": ["line", "style", "whl_no", "part", "dturn"],
                                "sql": "Select line,style,whl_no,part,dturn From grt_prod_part Where pid = '1' And whl_no = 'S3A17020'",
                                "displayRows": 20,
                                "name": "head",
                                "columnNames": ["线别", "鞋型", "轮号", "部位", "已制轮次"],
                                "rowHeight": 15,
                                "columnWidths": [60, 150, 100, 150, 100]
                            });
                        }
                    });
                    tbody.append(tr);
                });
            });

            $this.append(table);
            //
            return this;
        });
    };
})(jQuery);