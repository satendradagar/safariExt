var Store = {
    getItem: function(key) {
        var jsonString = safari.extension.settings.getItem('__' + key);
        if (jsonString) {
            var data = JSON.parse(jsonString);
            return data;
        }
    },
    setItem: function(key, data) {
        var jsonString = JSON.stringify(data);
        safari.extension.settings.setItem('__' + key, jsonString);
        return;
    },
    setCheckItem: function(key, data) {
        if (safari.extension.settings.getItem('__' + key) !== null) {
            return 0;
        }
        Store.setItem(key, data);
        return 1;
    },
    removeItem: function(key) {
        safari.extension.settings.removeItem('__' + key);
        return;
    },
    each: function(fn) {
        for (var keyword in safari.extension.settings) {
            if (keyword.substr(0, 2) == '__') {
                var data = Store.getItem(keyword.substr(2));
                fn(data);
            }
        }
        return;
    },
    clear: function() {
        safari.extension.settings.clear();
        return;
    }
};
