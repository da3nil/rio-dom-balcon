// jquery link
$(".intro__menu a").click(function() {
    let el = $(this)
    $('html, body').animate({
        scrollTop: $(el.attr('href')).offset().top - (screen.height * 0.25)
    }, 1000); // Скорость прокрутки
});

// change type interrogate
var type = "Классический балкон";
var serv = "Затрудняюсь ответить";

function changeTypeIntorr(str) {
    type = str;
}

function changeServIntorr(str) {
    serv = str;
}

// open city model after 15s
setTimeout(function () {
    if (!interModal) {
        $("#cityModal").modal('show');
    }
}, 10000)

// Change header when scroll changed
$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 200) {
        $(".intro__head").addClass("scrolled");
    } else {
        $(".intro__head").removeClass("scrolled");
    }
});

// Geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    let result = $.get("https://geocode-maps.yandex.ru/1.x", {
        geocode: position.coords.longitude + ", " + position.coords.latitude,
        apikey: "5f465faa-835b-4029-a00d-fd2f62c28240",
        kind: "locality",
        format: "json"
    });
    console.log(result);
    console.log("Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude);
}

getLocation()

var mobile = false;

if ($(window).width() < 767) {
    console.log("<")
    $("#city__input-text").attr('placeholder', "Поиск");
    mobile = true;
}

//let city = ymaps.geolocation.get()

// if (ymaps.location) {
//     console.log(ymaps.location.city);
// }

// $("#city__input").text(city);
// $(".support__select").text(city);


// Выбор города
// Смена значения города из модального окна при нажатии город в выпадающем списке или общем списке

$(".city__dropdown").on("click", "button", function (e) {
    $("#city__input-text").val($(this).text())
    cityDrop.css('display', 'none');
    if (mobile) {
        let city = $("#city__input-text").val();
        if (city === "") {
            city = "Не выбран"
        }
        //console.log(city)
        $(".support__select").text(city);
        $("#city__input").val(city);
        $("#cityModal").modal('hide');
    }
})

$(".city__collection li").on('click', function (e) {
    $("#city__input-text").val($(this).text())
    if (mobile) {
        let city = $("#city__input-text").val();
        if (city === "") {
            city = "Не выбран"
        }
        //console.log(city)
        $(".support__select").text(city);
        $("#city__input").val(city);
        $("#cityModal").modal('hide');
    }
})

$("#cityOpen").on('click', function () {
    //console.log('close')
    let city = $("#city__input-text").val();
    if (city === "") {
        city = "Не выбран"
    }
    //console.log(city)
    $(".support__select").text(city);
    $("#city__input").val(city);
    $("#cityModal").modal('hide');
})

// Изменено поле ввода
$("#city__input-text").on('input', function () {
    if ($("#city__input-text").val().length === 0) {
        //console.log("no")
        cityDrop.css('display', 'none');
    } else {
        //console.log("yes")
        let s = $("#city__input-text").val();
        getCity(s)
    }
})

// Получить названия городов по части строки
var gettingCity = false;
function getCity(s) {
    if (!gettingCity) {
        gettingCity = true;
        $.ajax({
            url: "city.php",
            type: "POST",
            data: {"name": s},
            success: function(msg){
                //console.log("Форма успешно отправлена")
                //console.log(msg)
                let data = JSON.parse(msg)
                // console.log(data)
                cityRender(data)
            },
            error: function () {
                console.log("Ошибка отправки формы")
            }
        });
        gettingCity = false;
    } else {
        setTimeout(function () {
            gettingCity = false;
            if ($("#city__input-text").val().length ==! 0) {
                getCity(s);
            }
        }, 300);
    }
}

var cityDrop = $(".city__dropdown");

function cityRender(data = []) {
    cityDrop.children().remove();
    if (data.length === 0) {
        cityDrop.css('display', 'none');
    } else {
        cityDrop.css('display', 'block');
        for (let i = 0; i < data.length; i++) {
            cityDrop.append("<li><button>" + data[i] + "</button></li>");
        }
    }
}

$('#cityModal').on('hidden.bs.modal', function (e) {
    console.log('close')
    let city = $("#city__input-text").val();
    if (city === "") {
        city = "Не выбран"
    }
    console.log(city)
    $(".support__select").text(city);
    $("#city__input").val(city);
    $("#interrogation__city").val(city);
    $("#cityModal").modal('hide');
})

function sendInterModal() {
    let phone = $("#modal2-phone").val();
    let name = $("#modal2-name").val();
    let city = $("#interrogation__city").val()
    let err = [];
    let messenger = $(".interrRadio:checked").val();

    let material_raw = $("input[name=material]:checked").val();
    let material = "Неизвестно"

    switch (material_raw) {
        case '1':
            material = "Пенополистирол";
            break
        case '2':
            material = "Пенопласт ПСБ-С35";
            break
        case '3':
            material = "Минеральная вата";
            break
        case '4':
            material = "Полиэтилен Фольгированный ";
            break
        default:
            material = "Неизвестно";
            break
    }

    if (phone.length !== 18) {
        err = err.concat("Телефон введен некорректно")
    }

    if (name === "") {
        err = err.concat("Имя введено некорректно")
    }


    let msg = "";
    if (err.length > 0) {
        msg = "\n";
        msg += err;
        alert("Ошибка отправки формы: " + msg)
        return false;
    }

    let data = {"name": name, "phone": phone, "city": city, "type": type, "material": material, "serv": serv, "messenger": messenger};

    console.log(data)

    $.ajax({
        url: "interrogation.php",
        type: "POST",
        data: data,
        success: function(msg){
            // alert("Форма успешно отправлена")
            console.log(msg);
            $("#interrogationModal .modal-info").css('opacity', 0);
            $("#interrogationModal .modal-success").css('opacity', 1);
        },
        error: function () {
            alert("Ошибка отправки формы")
        }
    });
}

// Отправка формы из модального окна
function sendModal() {
    let phone = $("#modal-phone");
    let name = $("#modal-name");
    let err = [];
    let msg = "";

    if (phone.val().length !== 18) {
        err = err.concat("Телефон введен некорректно")
    }

    if (name.val() === "") {
        err = err.concat("Имя введено некорректно")
    }

    if (err.length > 0) {
        msg = "\n";
        msg += err;
        alert("Ошибка отправки формы: " + msg)
        return false;
    }

    $.ajax({
        url: "support.php",
        type: "POST",
        data: $('.modal form').serialize(),
        success: function(msg){
            // alert("Форма успешно отправлена")
            $("#exampleModal .modal-info").css('opacity', 0);
            $("#exampleModal .modal-success").css('opacity', 1);
        },
        error: function () {
            alert("Ошибка отправки формы")
        }
    });
}

// Отправка формы из калькулятора
function sendCalc() {
    let container = $(".calc");
    let phone = $(".calc__input-number").val();
    let name = "Неизвестно";
    let value = value_calc;

    if (phone.length !== 18) {
        alert("Телефон введен некорректно")
        return false;
    }

    if ($(".calc__pc input[name='rooms']").val() == "") {
        // Получение данных из мобильной версии
        let type = $(".calc__mobile input[name='type']:checked").val()
        let repairs = $(".calc__mobile input[name='repairs']:checked").val()
        let view = $(".calc__mobile input[name='view']:checked").val()
        let redevelopment = $(".calc__mobile input[name='redevelopment']:checked").val()
        let alignment = $(".calc__mobile input[name='alignment']:checked").val()
        let rooms = $(".calc__mobile input[name='rooms']").val()
        let area = $(".calc__mobile input[name='area']").val()

        let data = {
            "type" : type,
            "repairs" : repairs,
            "view" : view,
            "redevelopment" : redevelopment,
            "alignment" : alignment,
            "rooms" : rooms,
            "area" : area,
            "value" : value,
        }

        console.log('data', data);

        $.ajax({
            url: "calc.php",
            type: "POST",
            data: {"name": name, "phone": phone, "data": data},
            success: function(msg){
                alert("Форма успешно отправлена")
                console.log(msg)
            },
            error: function () {
                alert("Ошибка отправки формы")
            }
        });

    } else {
        // Получение данных из комп. версии
        let type = $(".calc__pc input[name='type']:checked").val()
        let repairs = $(".calc__pc input[name='repairs']:checked").val()
        let view = $(".calc__pc input[name='view']:checked").val()
        let redevelopment = $(".calc__pc input[name='redevelopment']:checked").val()
        let alignment = $(".calc__pc input[name='alignment']:checked").val()
        let rooms = $(".calc__pc input[name='rooms']").val()
        let area = $(".calc__pc input[name='area']").val()

        let data = {
            "type" : type,
            "repairs" : repairs,
            "view" : view,
            "redevelopment" : redevelopment,
            "alignment" : alignment,
            "rooms" : rooms,
            "area" : area,
            "value" : value,
        }

        console.log('data', type, repairs, view, redevelopment, alignment, rooms, area);

        $.ajax({
            url: "calc.php",
            type: "POST",
            data: {"name": name, "phone": phone, "data": data},
            success: function(msg){
                alert("Форма успешно отправлена")
                console.log(msg)
            },
            error: function () {
                alert("Ошибка отправки формы")
            }
        });
    }

    // alert("Заявка принята")
}

// Отправка формы из подвала
function supportSend() {
    let phone = $("#support-phone");
    let name = $("#support-name");
    let err = [];
    let msg = "";

    if (phone.val().length !== 18) {
        err = err.concat("Телефон введен некорректно")
    }

    if (name.val() === "") {
        err = err.concat("Имя введено некорректно")
    }

    if (err.length > 0) {
        msg = "\n";
        msg += err;
        alert("Ошибка отправки формы:" + msg)
        return false;
    }

    $.ajax({
        url: "support.php",
        type: "POST",
        data: $('.support form').serialize(),
        success: function(msg){
            // alert("Форма успешно отправлена")
            $(".support .modal-info").css('opacity', 0);
            $(".support .modal-success").css('opacity', 1);
        },
        error: function () {
            alert("Ошибка отправки формы")
        }
    });
}


$('.flowing-scroll').on( 'click', function(){
    var el = $(this);
    var dest = el.attr('href'); // получаем направление
    if(dest !== undefined && dest !== '') { // проверяем существование
        $('html').animate({
                scrollTop: $(dest).offset().top // прокручиваем страницу к требуемому элементу
            }, 500 // скорость прокрутки
        );
    }
    return false;
});

let form = new WOW(
    {
        boxClass: 'form-animate',
        // animateClass: 'animated',
        live: false,
    });

var formNotOpened = true;

function showForm() {
    if (formNotOpened) {
        $(".form-animate").css('opacity', 1)
        form.init()
        // $(".form-animate").addClass('animate__animated animate__fadeInUp')
        formNotOpened = false;
    }
}

let phones = $('.phone');
let phone1 = $(".calc .phone");
let phone2 = $(".support .phone");
let phone3 = $("#exampleModal .phone");
let phone4 = $("#interrogationModal .phone");

phones.on("focus", function () {
    phones.attr("placeholder", "");

    if (phone1.val() === '') {
        phone1.val('+7 (');
    }

    if (phone2.val() === '') {
        phone2.val('+7 (');
    }

    if (phone3.val() === '') {
        phone3.val('+7 (');
    }

    if (phone4.val() === '') {
        phone4.val('+7 (');
    }
});

phones.on("blur", function () {
    phone1.attr("placeholder", "НОМЕР ТЕЛЕФОНА")
    phone2.attr("placeholder", "номер телефона")

    if (phone1.val() === '+7 (') {
        phone1.val('')
    }

    if (phone2.val() === '+7 (') {
        phone2.val('')
    }

    if (phone3.val() === '+7 (') {
        phone3.val('')
    }

    if (phone4.val() === '+7 (') {
        phone4.val('')
    }
});


phones.mask('+7 (000) 000 00 00');

$('.services__item').click(function () {
    $("#exampleModal").modal('show')
});

//swiper
var mySwiper = new Swiper('.reviews__swiper', {
    centeredSlides: true,
    slidesPerView: 1,
    // spaceBetween: 30,
    autoplay: {
        delay: 5000,
    },
    speed: 700,
    spaceBetween: 200,
    // loop: true,
    pagination: {
        el: '.swiper-pagination',// to find the swiper-pagination you put outside of the swiper-container
        clickable: true,
        renderBullet: function (index, className) {
            var slider_array = [];
            var el = $('.swiper-container')
            el.find('[data-name]').each(function () {
                slider_array.push($(this).data('name'));
            });

            // console.log(slider_array);
            return '<span class="indicators__item ' + className + '"></span>';
        }
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
})
mySwiper.autoplay.start();
// mySwiper.swipeNext(true, true);
// mySwiper.startAutoplay(); //just in case

updateValueCalcFolder();

$(".calc input").click(function (e) {
    updateValueCalcFolder()
})

$(".calc input").on('blur', function () {
    updateValueCalcFolder()
})

$(".calc__mobile input").on('click', function (e) {
    setTimeout(function () {
        mySwiper4.slideNext()
    }, 500)
})

$(".calc__pc input").on('click', function (e) {
    let elem = $(this).parents(".calc__pc > div")
    let next = elem.next()
    let prev = elem.prev()
    let nextNext = next.next()

    console.log(nextNext)

    nextNext.find('.calc__item').css("opacity", 1);
    nextNext.find('.calc__item input').removeAttr("disabled");
    nextNext.next().find('.calc__item').css("opacity", 1);
    nextNext.next().find('.calc__item input').removeAttr("disabled");

    if (next.find('div').hasClass('calc__next-info') && !next.find('div').hasClass('active')) {
        next.find('div').css("background", "url('img/calc__info-next-orange.png') no-repeat");
    }

    if (prev.find('div').hasClass('calc__next-info')) {
        prev.find('div').css("background", "url('img/calc__info-next.png') no-repeat");
        prev.find('div').addClass('active')
    }

})

function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function isEmpty(str) {
    return (typeof str === "undefined" || str === null || str ===  "");
}

var value_calc = 0;

function updateValueCalcFolder() {
    let elem = $(".calc__folder-value");
    let items = $(".calc input:radio:checked");
    let sum = 0;

    for (let i = 0; i < items.length; i++) {
        sum += $(items[i]).data('price');
    }

    let rooms = $(".calc__pc input[name='rooms']").val();
    let s = $(".calc__pc input[name='area']").val();

    let mrooms = $(".calc__mobile input[name='rooms']").val();
    let ms = $(".calc__mobile input[name='area']").val();

    if (isEmpty(rooms)) {
        if(isEmpty(mrooms)) {
            rooms = 0
        } else {
            rooms = mrooms
        }
    }
    if (isEmpty(s)) {
        if(isEmpty(ms)) {
            s = 0
        } else {
            s = ms
        }
    }

    sum += rooms * 10000;
    sum += s * 400;

    // sum = sum.toString()

    console.log(sum)

    value_calc = sum;

    if (sum === 0) {
        elem.text("")
        $(".calc__folder-last").text("")
    } else {
        elem.text(formatMoney(sum, "", "", "."))
        $(".calc__folder-last").text("РУБЛЕЙ")
    }

    // if (sum > 200000) {
        // showForm()
    // }
}

$(".calc input[name='area']").on('click', function () {
    showForm()
})

$(".calc__pc input[name='rooms']").on('blur', function () {
    if ($(".calc__pc input[name='rooms']").val() == "") {
        $(".calc__pc input[name='rooms']").val(3);
    }
})

$(".calc__mobile input[name='rooms']").on('blur', function () {
    if ($(".calc__mobile input[name='rooms']").val() == "") {
        $(".calc__mobile input[name='rooms']").val(3);
    }
})

$(".calc input[name='rooms'], .calc input[name='area']").on('click', function () {
    $(".calc__pc input[name='area']").parents('.calc__item').css('opacity', 1)
    $(".calc__pc input[name='area']").removeAttr('disabled')
    updateValueCalcFolder()
})

//swiper
let mySwiper2 = new Swiper('.swiper-container-2', {
    // slidesPerView: 1,
    // spaceBetween: 30,
    autoplay: {
        delay: 2500,
    },
    loop: true,
    pagination: {
        el: '.swiper-pagination-2',// to find the swiper-pagination you put outside of the swiper-container
        clickable: true,
        renderBullet: function (index, className) {
            var slider_array = [];
            var el = $('.swiper-container-2')
            el.find('[data-name]').each(function () {
                slider_array.push($(this).data('name'));
            });

            return '<span class="indicators__item ' + className + '"></span>';
        }
    },
});

let interrogation = new Swiper('.interrogation-swiper', {
    effect: 'fade',
    speed: 100,
    noSwiping: true,
    onlyExternal: true,
    allowTouchMove: false,
    slidesPerView: 1,
    navigation: {
        // nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

var interModal = false;

$('#interrogationModal').on('shown.bs.modal', function (e) {
    interModal = true;
})

$('#interrogationModal').on('hidden.bs.modal', function (e) {
    interModal = false;
})

interrogation.on('slideChange', function () {
    console.log('slide changed');
    console.log(interrogation.activeIndex)
    let title = $("#interrogation__title")
    switch (interrogation.activeIndex) {
        case 0:
            title.text("Какой у вас тип балкона");
            break;
        case 1:
            title.text("Выберете материал для шумоизоляции");
            break;
        case 2:
            title.text("Нужна ли Вам строительная подготовка к утеплению");
            break;
        case 3:
            title.text("В каком городе Вы находитесь");
            break;
        case 4:
            title.text(5);
            break;
    }
});


var interr = 1;
$(".interrogation__item").on("click", function () {
    interrogation.slideNext();
    if (interr < 5) {
        interr++;
        $(".interrogation__status span").text(interr + "/5");
        $(".interrogation__status-bar").css("width", (interr * 20) + "%");
    }
})

$(".interrogation__next").on("click", function () {
    interrogation.slideNext();
    console.log('n')
    if (interr < 5) {
        interr++;
        $(".interrogation__status span").text(interr + "/5");
        $(".interrogation__status-bar").css("width", (interr * 20) + "%");
    }
})

$(".interrogation-container .swiper-button-prev").on('click', function () {
    if (interr > 1) {
        interr -= 1;
        $(".interrogation__status span").text(interr + "/5");
        $(".interrogation__status-bar").css("width", (interr * 20) + "%");
    }
})

var mySwiper3 = new Swiper('.services__swiper-container', {
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: 5,
    grabCursor: true,
    breakpoints: {
        345: {
            slidesPerView: 1.2,
            spaceBetween: 10,
        },
        425: {
            slidesPerView: 1.5,
            spaceBetween: 20,
        },
    }
});

// CALC SWIPER FOR PHONE
var mySwiper4 = new Swiper('.calc__swiper-container', {
    // cssMode: true,
    onlyExternal: true,
    speed: 700,
    noSwiping: true,
    allowTouchMove: false,
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: -30,
    grabCursor: true,
    // breakpoints: {
    //     345: {
    //         slidesPerView: 1.2,
    //         spaceBetween: 10,
    //     },
    //     425: {
    //         slidesPerView: 1.5,
    //         spaceBetween: 20,
    //     },
    // }
});

$("#gallery-next").click(function () {
    mySwiper2.slideNext()
})

$(".calc__btn-next").click(function () {
    let item = $(".calc .swiper-slide-active input:radio:checked");
    if (item.length === 1) {
        mySwiper4.slideNext()
    }
});

$(".calc__btn-prev").click(function () {
    mySwiper4.slidePrev()
});
