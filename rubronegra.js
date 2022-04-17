const COLOR = {
    RED : "red",
    BLACK: "black",
    BLUE: "blue",
    WHITE: "white",
    CYAN: "cyan"
}

const POS = {
    NONE: -1,
    LEFT: 0,
    RIGHT: 1
}

function draw_node(ctx, color, stroke_color, text, x, y){
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2, true);
    ctx.strokeStyle = stroke_color;
    ctx.lineWidth = 2;
    ctx.save()
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore()
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "24px serif";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 8);
}

function draw_line(ctx, x1, y1, x2, y2){
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function draw_null_node(ctx, color, stroke_color, text, x, y){
    ctx.beginPath();
    ctx.fillRect(x - 22, y - 22, 22, 22);
    ctx.fillStyle = color;
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "30px serif";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 6);
}

function clear_node(ctx, x, y){
    ctx.beginPath()
    ctx.arc(x, y, 30, 0, 2 * Math.PI, true);
    ctx.fill();
}

function clear_line(ctx, x1, y1, x2, y2){
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = "6";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function clear_null_node(ctx, x, y){
    ctx.beginPath()
    ctx.fillRect(x - 22, y- 22, 22, 22);
}

class rubronegra_null_node {
    constructor(ctx, parent, localizacao) {
        this.valor = "";
        this.parent = parent;
        this.position_x = 0;
        this.position_y = 0;
        this.tree_height = 1;
        this.color = COLOR.CYAN;
        this.stroke_color = COLOR.WHITE;
        this.localizacao = localizacao;
        this.ctx = ctx;
    }

}

rubronegra_null_node.prototype.update_position = function (){
    if(this.parent){
        if(this.localizacao === POS.LEFT){
            this.position_x = this.parent.position_x - this.parent.filhos_offset;
        }else if(this.localizacao === POS.RIGHT){
            this.position_x = this.parent.position_x + this.parent.filhos_offset;
        }
        this.position_y = this.parent.position_y + 50;
    }
}

rubronegra_null_node.prototype.draw = function (){
    draw_node(this.ctx, this.color, this.stroke_color, this.valor, this.position_x, this.position_y);
}

rubronegra_null_node.prototype.draw_location_to_place = function (){
    this.ctx.beginPath();
    this.ctx.arc(this.position_x, this.position_y, 18, 0, Math.PI * 2, true);
    this.ctx.fillStyle = COLOR.CYAN;
    this.ctx.fill();
}

rubronegra_null_node.prototype.clear = function (){
    clear_node(this.ctx, this.position_x, this.position_y);
}

class rubronegra_node {

    constructor(ctx) {
        this.valor = 0;
        this.left = new rubronegra_null_node(ctx, this, POS.LEFT);
        this.right = new rubronegra_null_node(ctx, this, POS.RIGHT);
        this.parent = null;
        this.position_x = 0;
        this.position_y = 0;
        this.position_x_to_go = 0;
        this.position_y_to_go = 0;
        this.altura = -1;
        this.filhos_offset = 40;
        this.color = COLOR.RED;
        this.stroke_color = COLOR.BLACK;
        this.ctx = ctx;
        this.localizacao = POS.NONE;
        this.pronto = false;
    }
}

function update_filhos_altura(node, alt){
    if(!node)
        return;
    node.altura = alt;

    if(node.parent) {
        if (node === node.parent.left)
            node.localizacao = POS.LEFT;

        if (node === node.parent.right)
            node.localizacao = POS.RIGHT;
    }

    update_filhos_altura(node.left, alt + 1);
    update_filhos_altura(node.right, alt + 1);
}

rubronegra_node.prototype.set_position = function(x, y){
    this.position_x = x;
    this.position_y = y;

    if(this.left instanceof rubronegra_null_node) {
        this.left.update_position();
    }

    if(this.right instanceof rubronegra_null_node) {
        this.right.update_position();
    }
}

rubronegra_node.prototype.translate = async function (){
    await sleep(800);
    this.ctx.clearRect(0, 0, 2000, 1000);
    while(this.position_x !== this.position_x_to_go || this.position_y !== this.position_y_to_go){
        if(this.position_x < this.position_x_to_go){
            this.position_x+=5;
        }else if(this.position_x > this.position_x_to_go){
            this.position_x-=5;
        }

        if(this.position_y < this.position_y_to_go){
            this.position_y+=5;
        }else if(this.position_y > this.position_y_to_go){
            this.position_y-=5;
        }

        this.draw();
        await sleep(10);
        this.clear();
    }
    this.ctx.clearRect(0, 0, 2000, 1000);
    this.position_x = this.position_x_to_go;
    this.position_y = this.position_y_to_go;
    this.draw();
}

rubronegra_node.prototype.destacar = async function (habilitar) {
    if(habilitar){
        this.stroke_color = COLOR.CYAN;
    }else{
        this.stroke_color = COLOR.BLACK;
    }
}

rubronegra_node.prototype.set_position_to_go = function (x, y)
{
    this.position_x_to_go = x;
    this.position_y_to_go = y;

    if(this.left instanceof rubronegra_null_node) {
        this.left.update_position();
    }

    if(this.right instanceof rubronegra_null_node) {
        this.right.update_position();
    }
}

rubronegra_node.prototype.draw = function (){
    if(this.parent) {
        if (this.parent.left === this) {
            this.parent.draw_linha_esquerda();
        }
        if (this.parent.right === this) {
            this.parent.draw_linha_direita();
        }
    }

    draw_node(this.ctx, this.color, this.stroke_color, this.valor, this.position_x, this.position_y);


    let px = 40;
    if(this.parent){
        px = this.parent.filhos_offset;
    }

    if(this.left instanceof rubronegra_null_node) {
        this.left.position_x = this.position_x - px;
        this.left.position_y = this.position_y + 50;
    }

    if(this.right instanceof rubronegra_null_node) {
        this.right.position_x = this.position_x + px;
        this.right.position_y = this.position_y + 50;
    }
}

rubronegra_node.prototype.draw_linha_esquerda = function (){
    if(!(this.left instanceof rubronegra_null_node)){
        const left_x = this.left.position_x;
        const left_y = this.left.position_y;

        draw_line(this.ctx, this.position_x, this.position_y, left_x, left_y);
    }
}

rubronegra_node.prototype.draw_linha_direita = function (){
    if(!(this.right instanceof rubronegra_null_node)){
        const right_x = this.right.position_x;
        const right_y = this.right.position_y;
        draw_line(this.ctx, this.position_x, this.position_y, right_x, right_y);
    }
}

rubronegra_node.prototype.clear = function (){
    if(this.parent) {
        if (this.parent.left === this) {
            this.parent.clear_linha_esquerda();
        }
        if (this.parent.right === this) {
            this.parent.clear_linha_direita();
        }
    }
    clear_node(this.ctx, this.position_x, this.position_y);
}

rubronegra_node.prototype.clear_linha_esquerda = function (){
    if(!(this.left instanceof rubronegra_null_node)){
        const left_x = this.left.position_x;
        const left_y = this.left.position_y;
        clear_line(this.ctx, this.position_x, this.position_y, left_x, left_y);
    }
}

rubronegra_node.prototype.clear_linha_direita = function (){
    if(!(this.right instanceof rubronegra_null_node)){
        const right_x = this.right.position_x;
        const right_y = this.right.position_y;
        clear_line(this.ctx, this.position_x, this.position_y, right_x, right_y);
    }
}

class rubronegra {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.root = new rubronegra_null_node(this.ctx, this, POS.NONE);
        this.count = 0;
        this.altura = -1;
        this.position = 0;
        this.node_list = [];
        update_tree_visualization(this.node_list);
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function update_tree_visualization(node_array){
    window.requestAnimationFrame(function (){
        for(let n = 0; n < node_array.length; n++){
            node_array[n].draw();
        }
        update_tree_visualization(node_array);
    });
}

function desabilitar_linhas_recursivo(node){
    if(node instanceof rubronegra_null_node)
        return;

    node.clear_linha_esquerda();
    node.clear_linha_direita();

    desabilitar_linhas_recursivo(node.left);
    desabilitar_linhas_recursivo(node.right);
}

function habilitar_linhas_recursivo(node){
    if(node instanceof rubronegra_null_node || !node)
        return;

    node.draw_linha_esquerda();
    node.draw_linha_direita();

    habilitar_linhas_recursivo(node.left);
    habilitar_linhas_recursivo(node.right);
}

rubronegra.prototype.configurar_distancia = function (){
    let dis = []
    for(let i = this.altura; i > 0; i--){
        if(i > 1) {
            dis.push(i * 40 + 40);
        }else{
            dis.push(i * 40);
        }
    }
    dis.push(40);

    for(let i = 0; i < this.node_list.length; i++){
        this.node_list[i].filhos_offset = dis[this.node_list[i].altura];
    }

    let queue = [];

    queue.push(this.root);

    this.ctx.clearRect(0, 0, 2000, 1000);

    while(queue.length !== 0){
        let node = queue.shift();

        if(node.parent){
            const px = node.parent.position_x;
            const py = node.position_y;
            node.clear();
            if (node.localizacao === POS.LEFT) {
                node.set_position(px - node.parent.filhos_offset, py);
            } else if (node.localizacao === POS.RIGHT) {
                node.set_position(px + node.parent.filhos_offset, py);
            }
        }

        if(!(node.left instanceof rubronegra_null_node))
            queue.push(node.left);
        if(!(node.right instanceof rubronegra_null_node))
            queue.push(node.right);
    }
}

rubronegra.prototype.inserir = async function (valor) {
    const node = new rubronegra_node(this.ctx);
    node.valor = valor;

    let parent;
    let tmp = this.root;

    node.set_position(this.canvas.width / 2 - 50, 25);

    var altura = 0;
    while (!(tmp instanceof rubronegra_null_node)) {
        parent = tmp;
        node.set_position_to_go(parent.position_x, parent.position_y);
        await parent.destacar(true);

        if (node.valor < tmp.valor) {
            tmp = tmp.left;
        }
        else if(node.valor > tmp.valor) {
            tmp = tmp.right;
        }else{
            await parent.destacar(false);
            return;
        }


        await node.translate();
        await parent.destacar(false);
        if(tmp instanceof  rubronegra_null_node){
            tmp.update_position();
            tmp.draw_location_to_place();
        }
        altura++;
    }

    node.parent = parent;

    this.count++;
    if (!parent) {
        this.root = node;
        node.set_position_to_go(this.canvas.width / 2, 25);
    } else if (node.valor < parent.valor) {
        parent.left = node;
        node.localizacao = POS.LEFT;
        node.set_position_to_go(parent.position_x - node.parent.filhos_offset, parent.position_y + 50);
    } else {
        parent.right = node;
        node.localizacao = POS.RIGHT;
        node.set_position_to_go(parent.position_x + node.parent.filhos_offset, parent.position_y + 50);
    }

    await node.translate();
    this.node_list.push(node);

    node.altura = altura;

    if (!node.parent) {
        node.color = COLOR.BLACK;
        node.draw();
        return;
    }

    if (!node.parent.parent) {
        return;
    }

    altura = await this.balancearDepoisdeInserir(node, altura);

    if(altura > this.altura) {
        this.altura = altura;
        await sleep(800);
        this.configurar_distancia();
    }
}

rubronegra.prototype.rotacao_esquerda_animate = async function (node) {
    const root = node.right;

    const root_position_x = node.position_x;
    const root_position_y = node.position_y;

    const old_filhos_offset = node.filhos_offset;
    node.filhos_offset = root.filhos_offset;
    root.filhos_offset = old_filhos_offset;

    if(node.left instanceof rubronegra_null_node)
        node.left.update_position();
    node.set_position_to_go(node.left.position_x, node.left.position_y);

    if (!(node.left instanceof rubronegra_null_node)){
        node.left.set_position_to_go(node.left.position_x - node.left.parent.filhos_offset, node.left.position_y + 50);
        await node.left.translate();
    }

    await node.translate();

    root.set_position_to_go(root_position_x, root_position_y);
    await root.translate();

    if(!(root.right instanceof rubronegra_null_node)) {
        root.right.set_position_to_go(root_position_x + node.left.parent.filhos_offset, root_position_y + 50);
        await root.right.translate();
    }
}

rubronegra.prototype.rotacao_esquerda = async function (node) {
    await this.rotacao_esquerda_animate(node);

    const new_root = node.right;

    node.right = new_root.left;

    new_root.left.parent = node;

    new_root.parent = node.parent;

    if (!node.parent) {
        this.root = new_root;
    }

    else if (node === node.parent.left) {
        node.parent.left = new_root;
    } else {
        node.parent.right = new_root;
    }

    new_root.left = node;
    node.parent = new_root;

    update_filhos_altura(new_root, new_root.altura - 1);
}

rubronegra.prototype.rotacao_direita_animate = async function (node) {
    const new_root = node.left;

    const root_position_x = node.position_x;
    const root_position_y = node.position_y;

    const old_filhos_offset = node.filhos_offset;
    node.filhos_offset = new_root.filhos_offset;
    new_root.filhos_offset = old_filhos_offset;

    if(node.right instanceof rubronegra_null_node)
        node.right.update_position();
    node.set_position_to_go(node.right.position_x, node.right.position_y);

    if(!(node.right instanceof rubronegra_null_node)) {
        node.right.set_position_to_go(node.right.position_x + node.right.parent.filhos_offset, node.right.position_y + 50);
        await node.right.translate();
    }

    await node.translate();

    new_root.set_position_to_go(root_position_x, root_position_y);
    await new_root.translate();

    if(!(new_root.left instanceof rubronegra_null_node)) {
        new_root.left.set_position_to_go(root_position_x - node.left.parent.filhos_offset, root_position_y + 50);
        await new_root.left.translate();
    }
}

rubronegra.prototype.rotacao_direita = async function (node) {
    await this.rotacao_direita_animate(node);

    const new_root = node.left;

    node.left = new_root.right;

    new_root.right.parent = node;

    new_root.parent = node.parent;
    if (!node.parent) {
        this.root = new_root;
    } else if (node === node.parent.right) {
        node.parent.right = new_root;
    } else {
        node.parent.left = new_root;
    }

    new_root.right = node;
    node.parent = new_root;
    update_filhos_altura(new_root, new_root.altura - 1);
}

rubronegra.prototype.balancearDepoisdeInserir = async function (node, altura) {
    while (node.parent.color === COLOR.RED) {
        if (node.parent === node.parent.parent.left) {
            const uncle = node.parent.parent.right;
            if (uncle.color === COLOR.RED) {
                uncle.color = COLOR.BLACK;
                node.parent.color = COLOR.BLACK;
                node.parent.parent.color = COLOR.RED;
                node = node.parent.parent;
            }
            else {
                if (node === node.parent.right) {
                    node = node.parent;
                    await this.rotacao_esquerda(node);
                }
                node.parent.color = COLOR.BLACK;
                node.parent.parent.color = COLOR.RED;
                await this.rotacao_direita(node.parent.parent);
                altura--;
            }
        } else {
            const uncle = node.parent.parent.left;
            if (uncle.color === COLOR.RED) {
                uncle.color = COLOR.BLACK;
                node.parent.color = COLOR.BLACK;
                node.parent.parent.color = COLOR.RED;
                node = node.parent.parent;
            } else {
                if (node === node.parent.left) {
                    node = node.parent;
                    await this.rotacao_direita(node);
                }
                node.parent.color = COLOR.BLACK;
                node.parent.parent.color = COLOR.RED;
                await this.rotacao_esquerda(node.parent.parent);
                altura--;
            }
        }

        if (node === this.root) {
            break;
        }
    }

    this.root.color = COLOR.BLACK;
    return altura;
}

rubronegra.prototype.minimum = function (node) {
    while (!(node.left instanceof rubronegra_null_node)) {
        node = node.left;
    }
    return node;
}

rubronegra.prototype.maximum = function (node){
    while (!(node.right instanceof rubronegra_null_node)){
        node = node.right;
    }
    return node;
}

rubronegra.prototype.replace_sub_animation = function (node, parent, loc){
    if(node instanceof rubronegra_null_node){
        return;
    }
    if(!node.parent)
        node.clear();

    if (loc === POS.LEFT) {
        node.set_position_to_go(parent.position_x - parent.filhos_offset, parent.position_y + 50);
    } else if (loc === POS.RIGHT) {
        node.set_position_to_go(parent.position_x + parent.filhos_offset, parent.position_y + 50);
    }
    node.translate();

    this.replace_sub_animation(node.left, node, node.left.localizacao);
    this.replace_sub_animation(node.right, node, node.right.localizacao);
}

rubronegra.prototype.replace_animation = function (oldNode, newNode){
    if(!(newNode instanceof rubronegra_null_node)) {
        newNode.clear();
        this.ctx.clearRect(0, 0, 2000, 1000);
        newNode.set_position_to_go(oldNode.position_x, oldNode.position_y);
        newNode.translate();
    }
}

rubronegra.prototype.replace = function (oldNode, newNode) {
    if (! oldNode.parent) {
        this.root = newNode;
    } else if (oldNode === oldNode.parent.left) {
        oldNode.parent.left = newNode;
    } else {
        oldNode.parent.right = newNode;
    }
    newNode.parent = oldNode.parent;
    update_filhos_altura(newNode, newNode.altura - 1);
}

rubronegra.prototype.remover = async function (valor) {
    let forRemove = null;
    let tmp = this.root;

    // searching the node for removing
    while (!(tmp instanceof rubronegra_null_node)) {
        await tmp.destacar(true);
        await sleep(800);
        if (tmp.valor === valor) {
            forRemove = tmp;
            break;
        }
        await tmp.destacar(false);

        if (tmp.valor > valor) {
            tmp = tmp.left;
        } else {
            tmp = tmp.right;
        }
    }

    if (forRemove == null) {
        console.log('node not found');
        return;
    }

    let minRight = forRemove;
    let minRightColor = minRight.color;
    let newMinRight;


    if (forRemove.left instanceof rubronegra_null_node) {
        newMinRight = forRemove.right;
        this.replace_sub_animation(newMinRight, forRemove.parent, forRemove.localizacao);
        this.node_list.splice(this.node_list.indexOf(forRemove), 1);
        forRemove.clear();
        this.replace(forRemove, forRemove.right);
    } else if (forRemove.right instanceof rubronegra_null_node) {
        newMinRight = forRemove.left;
        this.replace_sub_animation(newMinRight, forRemove.parent, forRemove.localizacao);
        this.node_list.splice(this.node_list.indexOf(forRemove), 1);
       forRemove.clear();
        this.replace(forRemove, forRemove.left);
    } else {
        minRight = this.minimum(forRemove.right);
        minRightColor = minRight.color;
        newMinRight = minRight.right;

        if (minRight.parent === forRemove) {
            newMinRight.parent = minRight;
        }

        else {
            this.replace_sub_animation(minRight.right, minRight, minRight.localizacao);
            this.replace(minRight, minRight.right);
            minRight.right = forRemove.right;
            minRight.right.parent = minRight;
        }

        this.node_list.splice(this.node_list.indexOf(forRemove), 1);
        forRemove.clear();
        this.replace_animation(forRemove, minRight)
        this.replace(forRemove, minRight);
        minRight.left = forRemove.left;
        minRight.left.parent = minRight;
        minRight.color = forRemove.color;
    }

    if (minRightColor === COLOR.BLACK) {
        await this.balancearDepoisdeRemover(newMinRight);
    }

    let count = 0;
    for(let i = 0; i < this.node_list.length; i++){
        if(this.node_list[i].altura === this.altura){
            count++;
        }
    }
    if(count === 0 && this.altura > -1){
        this.altura--;
        await sleep(1000);
        this.configurar_distancia();
    }
}

rubronegra.prototype.balancearDepoisdeRemover = async function (node) {
    while (node !== this.root && node.color === COLOR.BLACK) {
        if (node === node.parent.left) {
            let brother = node.parent.right;

            if (brother.color === COLOR.RED) {
                brother.color = COLOR.BLACK;
                node.parent.color = COLOR.RED;
                await this.rotacao_esquerda(node.parent);
                brother = node.parent.right;
            }

            if (
                brother.left.color === COLOR.BLACK &&
                brother.right.color === COLOR.BLACK
            ) {
                brother.color = COLOR.RED;
                node = node.parent;
            } else {
                if (brother.right.color === COLOR.BLACK) {
                    brother.left.color = COLOR.BLACK;
                    brother.color = COLOR.RED;
                    await this.rotacao_direita(brother);
                    brother = node.parent.right;
                }

                brother.color = node.parent.color;
                node.parent.color = COLOR.BLACK;
                brother.right.color = COLOR.BLACK;
                await this.rotacao_esquerda(node.parent);
                node = this.root;
            }
        } else {
            let brother = node.parent.left
            if (brother.color === COLOR.RED) {
                brother.color = COLOR.BLACK;
                node.parent.color = COLOR.RED;
                await this.rotacao_direita(node.parent);
                brother = node.parent.left;
            }

            if (
                brother.left.color === COLOR.BLACK &&
                brother.right.color === COLOR.BLACK
            ) {
                brother.color = COLOR.RED;
                node = node.parent;
            } else {
                if (brother.left.color === COLOR.BLACK) {
                    brother.right.color = COLOR.BLACK;
                    brother.color = COLOR.RED;
                    await this.rotacao_esquerda(brother);
                    brother = node.parent.left;
                }

                brother.color = node.parent.color;
                node.parent.color = COLOR.BLACK;
                brother.left.color = COLOR.BLACK;
                await this.rotacao_direita(node.parent);
                node = this.root;
            }
        }
    }

    node.color = COLOR.BLACK;
}

rubronegra.prototype.buscar = async function(valor){
    let elem = null;
    let tmp = this.root;

    while (!(tmp instanceof rubronegra_null_node)) {
        await tmp.destacar(true);
        await sleep(800);
        if (tmp.valor === valor) {
            elem = tmp;
            break;
        }
        await tmp.destacar(false);

        if (tmp.valor > valor) {
            tmp = tmp.left;
        } else {
            tmp = tmp.right;
        }
    }

    if (elem == null) {
        window.alert("Elemento não encontrado!")
    }else{
        window.alert("Elemento encontrado!\nValor = " + elem.valor);
    }
}

let tree = new rubronegra(document.getElementById("tree"));

$("#add_button").click(async function () {
    let val = parseInt($("#fnumber").val(), 10);
    if(!isNaN(val)) {
        await tree.inserir(val);
    }
});

$("#remove_button").click(async function () {
    let val = parseInt($("#fnumber").val(), 10);
    if(!isNaN(val)){
        await tree.remover(val);
    }
});

$("#search_button").click(async function () {
    let val = parseInt($("#fnumber").val(), 10);
    if(!isNaN(val)) {
        await tree.buscar(val);
    }
});