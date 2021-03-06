$.extend(true, edges, {
    bs3 : {
        newSelectedFiltersRenderer: function (params) {
            if (!params) {
                params = {}
            }
            edges.bs3.SelectedFiltersRenderer.prototype = edges.newRenderer(params);
            return new edges.bs3.SelectedFiltersRenderer(params);
        },
        SelectedFiltersRenderer: function (params) {

            this.showFilterField = params.showFilterField || true;

            this.namespace = "edges-bs3-selected-filters";

            this.draw = function () {
                // for convenient short references
                var sf = this.component;
                var ns = this.namespace;

                // sort out the classes we are going to use
                var fieldClass = edges.css_classes(ns, "field", this);
                var fieldNameClass = edges.css_classes(ns, "fieldname", this);
                var valClass = edges.css_classes(ns, "value", this);
                var removeClass = edges.css_classes(ns, "remove", this);
                var relClass = edges.css_classes(ns, "rel", this);
                var containerClass = edges.css_classes(ns, "container", this);

                var filters = "";

                var fields = Object.keys(sf.mustFilters);
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    var def = sf.mustFilters[field];

                    filters += '<span class="' + fieldClass + '">';
                    if (this.showFilterField) {
                        filters += '<span class="' + fieldNameClass + '">' + def.display + ':</span>';
                    }

                    for (var j = 0; j < def.values.length; j++) {
                        var val = def.values[j];
                        filters += '<span class="' + valClass + '">' + val.display + '</span>';

                        // the remove block looks different, depending on the kind of filter to remove
                        if (def.filter == "term" || def.filter === "terms") {
                            filters += '<a class="' + removeClass + '" data-bool="must" data-filter="' + def.filter + '" data-field="' + field + '" data-value="' + val.val + '" alt="Remove" title="Remove" href="#">';
                            filters += '<i class="glyphicon glyphicon-black glyphicon-remove"></i>';
                            filters += "</a>";
                        } else if (def.filter === "range") {
                            var from = val.from ? ' data-from="' + val.from + '" ' : "";
                            var to = val.to ? ' data-to="' + val.to + '" ' : "";
                            filters += '<a class="' + removeClass + '" data-bool="must" data-filter="' + def.filter + '" data-field="' + field + '" ' + from + to + ' alt="Remove" title="Remove" href="#">';
                            filters += '<i class="glyphicon glyphicon-black glyphicon-remove"></i>';
                            filters += "</a>";
                        }

                        if (def.rel) {
                            if (j + 1 < def.values.length) {
                                filters += '<span class="' + relClass + '">' + def.rel + '</span>';
                            }
                        }
                    }
                    filters += "</span>";
                }

                if (filters !== "") {
                    var frag = '<div class="' + containerClass + '">{{FILTERS}}</div>';
                    frag = frag.replace(/{{FILTERS}}/g, filters);
                    sf.context.html(frag);

                    // click handler for when a filter remove button is clicked
                    var removeSelector = edges.css_class_selector(ns, "remove", this);
                    edges.on(removeSelector, "click", this, "removeFilter");
                } else {
                    sf.context.html("");
                }
            };

            /////////////////////////////////////////////////////
            // event handlers

            this.removeFilter = function (element) {
                var el = this.component.jq(element);
                var field = el.attr("data-field");
                var ft = el.attr("data-filter");
                var bool = el.attr("data-bool");

                var value = false;
                if (ft === "terms" || ft === "term") {
                    value = el.attr("data-value");
                } else if (ft === "range") {
                    value = {};
                    var from = el.attr("data-from");
                    var to = el.attr("data-to");
                    if (from) {
                        value["from"] = parseInt(from);
                    }
                    if (to) {
                        value["to"] = parseInt(to);
                    }
                }

                this.component.removeFilter(bool, ft, field, value);
            };
        }
    }
});
