jQuery(document).ready(function($) {
    e = edges.init({
        selector: "#edges",
        template: edges.bs3.facetview,
        search_url: "http://localhost:9200/doaj/journal/_search",
        components: [
            edges.newTermSelector({
                id: "publisher",
                field: "index.publisher.exact",
                display: "Publisher"
            }),
            edges.newResultsDisplay({
                id: "results"
            })
        ]
    });
});