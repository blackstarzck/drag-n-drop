

class Draggable {
    constructor(container) {
        this.container = document.querySelector(container);
        this.children = this.container.children;

        this.init();
    }

    init() {
        let container = this.container;
        let total = this.children.length;
        let itemsArray = [];
        let flag = "init";
        let flag_a = true;
        let prev;
        
        // container.style.position = "relative";

        for(let i = 0; i < total; i++){
            let item = this.children[i];
            let styleObj = { 
                order: i,
                name: "ITEM-" + i, 
                node: item,
                width: item.clientWidth,
                height: item.clientHeight,
                x: item.offsetLeft,
                y: item.offsetTop,
            };

            itemsArray.push(styleObj);
        }

        console.log(itemsArray);

        for(let i = 0; i < total; i ++){
            let item = this.children[i];
            let offX = item.offsetLeft;
            let offY = item.offsetTop;

            // console.log(`offX: ${offX} | offY: ${offY}`);

            item.onmousedown = function(evt){
                /* getBoundingClientRect():  메서드는 엘리먼트의 크기와 뷰포트에 상대적인 위치 정보를 제공 */
                // let shiftX = evt.pageX - this.getBoundingClientRect().left;
                // let shiftY = evt.pageY - this.getBoundingClientRect().top;
                let shiftX = evt.pageX - this.offsetLeft;
                let shiftY = evt.pageY - this.offsetTop;
                let index = getIndex(item);
                /* 브라우저 안에서의 마우스 위치 - 요소의 위치 = 브라우저 안에서의 요소 위치 값 */
                
                function createPlaceHolder(behindItem, idx){
                    let elem = item.cloneNode(); 
                    elem.style = "";
                    elem.className = "placeholder";
                    elem.style.width = item.clientWidth+"px",
                    elem.style.height = item.clientHeight+"px",
                    elem.style.backgroundColor = "yellow";
                    let placeholder = document.querySelector(".placeholder");
                    
                    if(placeholder){
                        placeholder.remove();
                    }

                    // console.log(`========= idx: ${idx} =========`);
                    if(idx == -1){
                        container.prepend(elem);
                    }else{
                        container.insertBefore(elem, behindItem.nextElementSibling);
                    }
                    
                    if(flag == "end"){
                        item.classList.add("float");
                        item.style.width = item.clientWidth;
                        flag_a = false;
                    }
                }

                function moveAt(pageX, pageY) {
                    let cont_x = container.offsetLeft + container.clientWidth;
                    let cont_y = container.offsetTop + container.clientHeight;
                    let x = pageX - shiftX;
                    let y = pageY - shiftY;

                    console.log(`${pageX} | ${pageY}`);

                    if((pageX > container.offsetLeft && pageX < cont_x) && (pageY > container.offsetTop && pageY < cont_y)){
                        item.style.left = x + 'px';
                        item.style.top = y + 'px';
                    }else{
                        item.style.transition = "all .4s ease";
                        item.style.left = offX + "px";
                        item.style.top = offY + "px";

                        document.removeEventListener('mousemove', onMouseMove);

                        item.addEventListener("transitionend", function(e){
                            if(item.style.left == offX+"px" && item.style.top == offY+"px"){
                                console.log('hi')
                                setNewOrder();
                            }
                        }); 
                    }
                }

                function onMouseMove(evt) {
                    item.style.width = item.clientWidth+"px",
                    item.style.height = item.clientHeight+"px",
                    item.style.position = "absolute";
                    // item.style.zIndex = 1000;

                    if(flag == "init"){
                        createPlaceHolder(item);
                        flag = "end";
                    }

                    moveAt(evt.pageX, evt.pageY);
                    setOrder();
                }

                function setOrder(){
                    let curY = item.offsetTop;

                    for(let i = 0; i < itemsArray.length; i++){
                        if(curY > itemsArray[i].y && curY < (itemsArray[i].y + itemsArray[i].height)){
                            let behindItem = itemsArray[i].node;

                            if(flag_a == true){
                                prev = itemsArray[i].order;
                                createPlaceHolder(behindItem, i);
                            }else{
                                if(prev != itemsArray[i].order){
                                    flag_a = true;
                                }
                            }
                        }else{
                            if(flag_a == false && (prev == 0 && i == 0 && curY < itemsArray[0].y)){
                                createPlaceHolder(itemsArray[0].node, -1);
                                flag_a = true;
                            }
                        }
                    }
                }

                document.addEventListener('mousemove', onMouseMove);

                item.onmouseup = function() {
                    document.removeEventListener('mousemove', onMouseMove);
                    setNewOrder();
                };
                
                function setNewOrder(){
                    let placeholder = document.querySelector(".placeholder");


                    item.classList.remove("float");
                    
                    if(placeholder){
                        item.style = "";
                        container.insertBefore(item, placeholder.nextElementSibling);
                        document.querySelector(".placeholder").remove();
                    }

                    itemsArray[index].x = item.offsetLeft;
                    itemsArray[index].y = item.offsetTop;
                    
                    for(let n = 0; n < container.children.length; n++){
                        itemsArray[n].order = n;
                        itemsArray[n].node = container.children[n];
                        itemsArray[n].width = container.children[n].clientWidth;
                        itemsArray[n].height = container.children[n].clientHeight;
                        itemsArray[n].x = container.children[n].offsetLeft;
                        itemsArray[n].y = container.children[n].offsetTop;
                    }

                    console.log(itemsArray);

                    flag = "init"; // 초기화
                }

                function getIndex(ele){
                    let i = 0;
                    while( (ele = ele.previousElementSibling) != null ){
                        if(ele.className != "placeholder") i++;
                    }
                    return i;
                }
            }
        }
    }
}