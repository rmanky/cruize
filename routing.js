routing = (function() {
    let orsDirections = new Openrouteservice.Directions({
        api_key: '5b3ce3597851110001cf6248a488307605e94252ab6ba375cc36a86e'
    });

    function bar() { // this function not available outside your module
        alert(my_var); // this function can access my_var
    }

    return {
        a_func: function() {
            alert(my_var); // this function can access my_var
        },
        b_func: function() {
            alert(my_var); // this function can also access my_var
        }
    };
})();