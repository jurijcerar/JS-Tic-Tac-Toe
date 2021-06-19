$(document).ready(function(){

    var position = ["E", "E", "E", "E", "E", "E", "E", "E", "E"];
    let me = 0;
    let ab = 0;
    let dr = 0;
    $('td').click(function() {
        let i = parseInt(this.id);
        if(position[i] == "E"){ //preverim če polje že ni zasedeno
            $(this).addClass('x'); //dodam potezo v array in jo prikažem v html-ju
            position[i] = "X";
            if(game_over(position)){ //preverim če je igre konec 
                console.log("Zmagal X");
                me++;
                $("#me").text("Jaz: "+me);
                reset(position);
            }
            else{ //če ni igre konec dam računalniku možnost
                let temp = JSON.parse(JSON.stringify(position)); //deep copy arraya
                let d = $( "#depth" ).val(); //težavnost ozioma globina
                console.log(d);
                let r = alfa_beta(temp,1,d,-100,100); //klic alfa beta
                position[r.move] = "O"; //dodam njegovo potezo in jo izšišem v htmlju
                let j = "#"+r.move;
                $(j).addClass('o');
                if(game_over(position)){ //preverim če je računalnik zmagal
                    console.log("Zmagal O");
                    ab++;
                    $("#ab").text("Alfa-Beta: "+ab);
                    reset(position);
                }
            }
        }

        if(!position.includes("E")){ //preverim če je igre konec oz ni več možnih potez
            console.log("Izenačeno");
            dr++;
            $("#draw").text("Izenačeno: "+dr);
            reset(position);
        }
    });
});

function reset(position){ //resetiram polje in array
    let j;
    for (let i = 0; i < position.length; i++){
        position[i] = "E";
        j = "#"+i;
        $(j).removeClass();
    }
}

function game_over(position){
    for (let i = 1; i < 4; i++) {  

        if(position[1*i-1] == position[1*i+2] && position[1*i+2] == position[1*i+5] && position[1*i-1] != "E"){ //preverim vse vrstice
            return true;
        }

        if(position[3*i-3] == position[3*i-2] && position[3*i-2] == position[3*i-1] && position[3*i-3] != "E"){ //preverim vse stolpce
            return true;
        }

    }

    if(position[2] === position[4] && position[4] === position[6] && position[4] != "E" ){ //diagonala 1
        return true;
    }

    if(position[0] === position[4] && position[4] === position[8] && position[4] != "E"){ //diagonala 2
        return true;
    }

    return false;
}

function column_evaluation(position, c){
    let evaluation = 0;

    for (let i = 1; i < 4; i++) {  //preverim vse stolpce

        if(position[1*i-1] === c && position[1*i+2] === c && position[1*i+5] === c){ //če so vse tri enake 
            evaluation += 100;
        } //če sta 2 vrednosti enaki
        else if((position[1*i-1] === c && position[1*i+2] === c) || (position[1*i-1] === c && position[1*i+5] === c) || (position[1*i+5] === c && position[1*i+2] === c)){
            evaluation += 10;
        }
        else if(position[1*i-1] === c || position[1*i+2] === c || position[1*i+5] === c){ //če ne pa če je samo ena enaka
            evaluation += 1;
        }
    }

    return evaluation;
}

function row_evaluation(position,c){ //vse isto kot za stolpce le da za vrstice
    let evaluation = 0;

    for (let i = 1; i < 4; i++) {   

        if(position[3*i-3] === c && position[3*i-2] === c && position[3*i-1] === c){
            evaluation += 100;
        }
        else if((position[3*i-3] === c && position[3*i-2] === c) || (position[3*i-3] === c && position[3*i-1] === c) || (position[3*i-1] === c && position[3*i-2] === c)){
            evaluation += 10;
        }
        else if(position[3*i-3] === c || position[3*i-2] === c || position[3*i-1] === c){
            evaluation += 1;
        }
    }

    return evaluation;
}

function diagonal_evaluation(position,c){ //preverim obe diagonali isto kot stolpce in vrstice
    let evaluation = 0;

    if(position[0] === c && position[4] === c && position[8] === c){
        evaluation += 100;
    }
    else if((position[0] === c && position[4] === c) || (position[0] === c && position[8] === c) || (position[8] === c && position[4] === c)){
        evaluation += 10;
    }
    else if(position[0] === c || position[4] === c || position[8] === c){
        evaluation += 1;
    }

    if(position[2] === c && position[4] === c && position[6] === c){
        evaluation += 100;
    }
    else if((position[2] === c && position[4] === c) || (position[4] === c && position[6] === c) || (position[2] === c && position[6] === c)){
        evaluation += 10;
    }
    else if(position[2] === c || position[4] === c || position[6] === c){
        evaluation += 1;
    }

    return evaluation;
}

function game_evaluation(position){
    let evaluation = 0;
    evaluation -= row_evaluation(position,"X"); //oceni igre odštejem X-e oziroma moje znake in prištejem ocene njegovih znakov
    evaluation += row_evaluation(position,"O");
    evaluation -= column_evaluation(position,"X");
    evaluation += column_evaluation(position,"O");
    evaluation -= diagonal_evaluation(position,"X");
    evaluation += diagonal_evaluation(position,"O");
    return evaluation;
}

function develop(position){ //razvijem vse možne poteze v tej poziciji
    let m = [];
    for (let i = 0; i < position.length; i++) {
        if(position[i] == "E"){
            m.push(i);
        }
    }
    return m;
}

function alfa_beta(position,player,depth,alfa,beta){

    if (!position.includes("E") || depth == 0 || game_over(position)){ //preverim če je konec
        return {eval: game_evaluation(position), move: -1}
    }

    let evaluation = -100 * player;
    let move = -1;
    let result;
    let temp;
    let M = develop(position);

    for (let i = 0; i < M.length; i++) {
        temp = JSON.parse(JSON.stringify(position));
        if(player == 1){ //preveri kateri znak morem dodat
            temp[M[i]] = "O" 
        }

        if(player == -1){
            temp[M[i]] = "X" 
        }

        result = alfa_beta(temp,-player,depth-1,alfa,beta); //rekurzivni klic

        if(player == 1 && result.eval > evaluation){
            evaluation = result.eval;
            move = M[i];
            if(evaluation > alfa){
                alfa = evaluation;
            }
        }
        else if(player == -1 && result.eval < evaluation){
            evaluation = result.eval;
            move = M[i];
            if(evaluation < beta){
                beta = evaluation;
            }
        }

        if(alfa >= beta){ //preverim alfabeta
            return {eval: evaluation, move: move};   
        }
    }
    return {eval: evaluation, move: move};
}