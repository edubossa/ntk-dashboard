toastr.options = {
    "closeButton": false,
    "debug": false,
    "progressBar": false,
    "positionClass": "toast-bottom-left",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "1000",
    "hideDuration": "1000",
    "timeOut": "10000",
    "extendedTimeOut": "3000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

function goodString(badString) {
    if (badString === undefined || badString === null) {
        badString = "";
    }
    return badString;
}
var spawnNotification = function(titulo, mensagem) {
    try {
        if (!'Notification' in window) return;
        console.log(Notification.permission);
        if (Notification.permission === 'default') {
            Notification.requestPermission(function() {
                notify();
            });
        } else if (Notification.permission === 'granted') {
            var opcoes = {
                body: mensagem,
                badge: '../public/images/favicon/apple-icon-120x120.png',
                icon: '../public/images/favicon/apple-icon-120x120.png'
            }
            var n = new Notification(titulo, opcoes);
            n.onclick = function() {
                this.close();
            };
            n.onclose = function() {
                console.log('Notification closed');
            };
        } else if (Notification.permission === 'denied') {
            return;
        }
    } catch (e) {
        console.log(e);
        return;
    }
};

function prepareOrderStatus(int_status, status_description) {
    var label, text_color, fa_icon, progress;
    label = status_description.toLowerCase();
    switch (int_status) {
        case 0:
            text_color = "";
            fa_icon = "fa-spinner fa-spin";
            break;
        case 1:
            text_color = "text-warning";
            fa_icon = "fa-check";
            break;
        case 2:
            text_color = "text-info";
            fa_icon = "fa-motorcycle";
            break;
        case 3:
            text_color = "text-danger";
            fa_icon = "fa-minus-circle";
            break;
        case 4:
            text_color = "";
            fa_icon = "fa-credit-card";
            break;
        case 6:
            text_color = "text-success";
            fa_icon = "fa-flag-checkered";
            break;
        default:
            text_color = "text-muted";
            fa_icon = "fa-question-circle-o";
    }
    var retorno = {
        "id": int_status,
        "label": label,
        "text_color": text_color,
        "fa_icon": fa_icon
    }
    return retorno;
}

function jsonToCsvConvertor(arrData) {
    var csv = '';
    var row = "";
    for (var index in arrData[0]) {
        row += index + ',';
    }
    row = row.slice(0, -1);
    csv += row + '\r\n';
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }
        row = row.slice(0, row.length - 1);
        csv += row + '\r\n';
    }
    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
    return uri;
}

function readImage(inputElement) {
    var deferred = $.Deferred();
    var files = inputElement.get(0).files;
    if (files && files[0]) {
        var fr = new FileReader();
        fr.onload = function(e) {
            deferred.resolve(e.target.result);
        };
        fr.readAsDataURL(files[0]);
    } else {
        deferred.resolve(undefined);
    }
    return deferred.promise();
}
