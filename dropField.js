//'Drag and drop' file upload plugin for jQuery
//Made by Gvozden Despotovski, April 2019.

//To do list
//  1. Check all items before restricting the amount of items that can be passed


(function ( $ ) {
 
    var action;
    var onDrop, onDragover, onLeave, options, limit, ext;
    $.fn.dropField = function(pvt_onDrop, pvt_onDragover, pvt_onLeave, pvt_options) {

        //Making everything public for other functions
        onDrop = pvt_onDrop;
        onDragover = pvt_onDragover;
        onLeave = pvt_onLeave;
        options = pvt_options;
        ext = options.allowedExtensions;

        //Setting up the drop field
        $(this).attr("ondrop", "$(this).dropped(event)");
        $(this).attr("ondragleave", "$(this).dragLeave(event)");
        $(this).attr("ondragover", "$(this).dragOver(event)");

        //Setting up some variables

        if(options.fileLimit !== undefined && options.fileLimit > 0){
            pvt_limit = options.fileLimit;
        } else pvt_limit = 0;

        limit = pvt_limit;

        return this;
    };

    $.fn.dropped = function(ev){
        
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)

            if(options.multipleFiles !== undefined && options.multipleFiles == true){ //Send multiple files or just one?

                if(limit == 0){
                    limit = ev.dataTransfer.items.length;
                } else if(ev.dataTransfer.items.length < limit){
                    limit = ev.dataTransfer.items.length;
                }

                for (var i = 0; i < limit; i++) {
                    // If dropped items aren't files, reject them
                        if (ev.dataTransfer.items[i].kind === 'file') {
                            var file = ev.dataTransfer.items[i].getAsFile();
                            if(file.size <= options.fileSize && options.fileSize !== 0){
                                if(ext !== undefined){
                                    var extTest = file.type.split("/");
                                    var match = 0;
                                    for(var p = 0; p <= ext.length - 1; p++){
                                        if(ext[p] == extTest[1]){
                                            match = 1;
                                            break;
                                        }
                                    }
    
                                    if(match == 0){
                                        onDrop(undefined, {"status":11,"info":"This file type is not supported."+"'"+extTest[1]+"'"});
                                    } else onDrop(file);
                                } else onDrop(file);
                            } else {
                                var e = {"status":10,"info":file.name+" is too big! "+file.size+"/"+options.fileSize+" bytes"};
                                onDrop(undefined, e);
                            }
                        }
                    }
            } else {
                for(var i = 0; i <= ev.dataTransfer.items.length; i++){
                    var file = ev.dataTransfer.items[i].getAsFile();
                    if(file.size <= options.fileSize && options.fileSize > 0){
                        if(ext !== undefined){
                            var extTest = file.type.split("/");
                            var match = 0;
                            for(var p = 0; p <= ext.length - 1; p++){
                                if(ext[p] == extTest[1]){
                                    match = 1;
                                    break;
                                }
                            }
                            if(match == 0){
                                onDrop(undefined, {"status":11,"info":"This file type is not supported."+"'"+extTest[1]+"'"});
                                break;
                            } 
                        }else {
                                onDrop(file);
                                break;
                            }
                    } else {
                        var e = {"status":10,"info":file.name+" is too big! "+file.size+"/"+options.fileSize+" bytes"};
                        onDrop(undefined, e);
                        break;
                    }
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            if(options.multipleFiles !== undefined && options.multipleFiles == true){
                if(limit == 0){
                    limit = ev.dataTransfer.files.length;
                } else if(ev.dataTransfer.files.length < limit){
                    limit = ev.dataTransfer.files.length;
                }
                for (var i = 0; i < limit; i++) {
                    for(var i = 0; i <= ev.dataTransfer.items.length; i++){
                        var file = ev.dataTransfer.items[i].getAsFile();
                        if(file.size <= options.fileSize && options.fileSize > 0){
                            if(ext !== undefined){
                                var extTest = file.type.split("/");
                                var match = 0;
                                for(var p = 0; p <= ext.length - 1; p++){
                                    if(ext[p] == extTest[1]){
                                        match = 1;
                                        break;
                                    }
                                }
                                if(match == 0){
                                    onDrop(undefined, {"status":11,"info":"This file type is not supported."+"'"+extTest[1]+"'"});
                                    break;
                                } 
                            }else {
                                    onDrop(file);
                                    break;
                                }
                        } else {
                            var e = {"status":10,"info":file.name+" is too big! "+file.size+"/"+options.fileSize+" bytes"};
                            onDrop(undefined, e);
                            break;
                        }
                    }
                    }
            } else {
                var file = ev.dataTransfer.files[0].getAsFile();
                if(file.size <= options.fileSize && options.fileSize > 0){
                    
                    onDrop(file); //Send only one
                } else {
                    var e = {"status":10,"info":file.name+" is too big! "+file.size+"/"+options.fileSize+" bytes"};
                    onDrop(undefined, e);
                }
            }
        }
    };

    $.fn.dragLeave = function(event){
        onLeave();

        event.preventDefault();
    }
    $.fn.dragOver = function(event){
        onDragover();

        event.preventDefault();
    }
 
}( jQuery ));