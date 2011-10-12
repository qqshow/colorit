$(function(){

    //==============zeroclipboard init ===============
    ZeroClipboard.setMoviePath( '/swf/ZeroClipboard.swf' );
    CLIPBOARD = new ZeroClipboard.Client();
    CLIPBOARD.setHandCursor( true );
    CLIPBOARD.glue( 'd_clip_button', 'd_clip_container' );

    //==============language select===============
    SELECTED_LANG = null;
    $('#type_selector').change(function(){
        if($('#type_selector').val() != ''){
            $('#color_it').removeClass('btn_color_forbid').addClass('btn_color_free');
            SELECTED_LANG = $('#type_selector').val();
        }else{
            $('#color_it').removeClass('btn_color_free ').addClass('btn_color_forbid');
        }
    });

    //==============color it function===============
    colorIt = function(){
        var options = '';
        if($('#format:checked').val() !== undefined) options += 'format_';
        if($('#number:checked').val() !== undefined) options += 'number_';
        data = {code:$('#black_code_box').val(), type:SELECTED_LANG, options:options  };
        $.post('/zarkapi/getcolorcode',data,function(cc){
            $('#black_code_box').hide();
            $('#color_code_box').html(cc).show();
            $('#code_box').height(Math.max($('#black_code_box').height(),$('#color_code_box').height())+40);
            CLIPBOARD.setText( $('#color_code_box').html() );
        },'text');
        $('#color_it').html('clean');
        IS_SHOW_COLOR_CODE = true;
    }

    //==============clean code function===============
    IS_SHOW_COLOR_CODE = false;
    cleanCode = function(){
        $('#black_code_box').val('').show();
        $('#color_code_box').html('').hide();
        $('#code_box').height($('#black_code_box').height()+40);
        $('#color_it').html('color it');
        IS_SHOW_COLOR_CODE = false;
    };

    //==============color it button===============
    $('#color_it').click(function(){
        //如果还没有输入任何代码，就提示他输入代码
        if( (($('#black_code_box').attr('firstfocus') === 'false') || ($.trim($('#black_code_box').val().length===0))).toString() === 'true' ){
            $('#black_code_box').val($('#black_code_box').val()+'Please input your code first!\n');
            $('#black_code_box').attr('firstfocus','false').css('font-size','24px');
            return;
        };
        if (IS_SHOW_COLOR_CODE === false){
            if (SELECTED_LANG !== null){
                colorIt();
            }else{
                $('#choose_lang_box').toggle();
            }
        }else{
            cleanCode();
        }
    });

    //==============choose language button===============
    $('#choose_lang').click(function(){
        $('#choose_lang_box').toggle();
    });

    //==============choose language box===============
    $('#choose_lang_box li').click(function(){
        SELECTED_LANG = $(this).attr('val');
        if($.trim($('#black_code_box').val()).length>0){
            colorIt();
        };
        $('#choose_lang_box').hide();
    });

    //==============checkbox change event===============
    $('#format, #number').change(function(){
        if (IS_SHOW_COLOR_CODE === true){
            colorIt();
        }
    });

    //==============custom lang input event===============
    $('#custom_lang_input').focus(function(){
        if ($(this).attr('firstfocus') === 'false'){
            $(this).css('color','#000;').attr('firstfocus','true').css('text-align','left').val('');
        }
    }).keypress(function(event){
        if(event.keyCode==13) {
            SELECTED_LANG = $(this).val();
            $('#choose_lang_box').hide();
            colorIt();
            return false;                               
        }
    });
    $('#custom_lang_input').css('color','gray;').attr('firstfocus','false').css('text-align','center').val('input your suffix');

    //==============black_code_box input event===============
    $('#black_code_box').focus(function(){
        if ($(this).attr('firstfocus') === 'false'){
            $(this).attr('firstfocus','true').css('font-size','14px').val('');
        }
    });
    $('#black_code_box').attr('firstfocus','false').css('font-size','24px').val('Input your code and color it!\n');

    //==============布局===============
    var client_x = document.documentElement.clientWidth;
    var client_y = document.documentElement.clientHeight;
    var code_box_width = client_x-90-126-200;
    $('#code_box').width(code_box_width);
    $('#cc_top').width(code_box_width+20);
    $('#black_code_box, #color_code_box').width(code_box_width-40);
    $('#choose_lang_box').animate({opacity:0.8});

});
