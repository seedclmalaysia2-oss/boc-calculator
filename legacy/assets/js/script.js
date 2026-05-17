
function onchangeValueFormat(e){
    this.value = parseFloat(this.value).toFixed(2)
    Calculation()
}

function inputValueFunc(id, id2){
    var elementValue = 337.5 / parseFloat(document.getElementById(`${id}`).value || 0);
    document.getElementById(`${id2}`).value = valueFormat(elementValue);
    Calculation()
}

function resetField(id){
    
    document.getElementById(`${id}`).value = '';
}

function Calculation(displayResultFlag = false){
    
    var cell_c3 = parseFloat(document.getElementById('cell_c3').value || 0)
    var cell_d3 = parseFloat(document.getElementById('cell_d3').value || 0)
    var cell_c4 = parseFloat(document.getElementById('cell_c4').value || 0)
    var cell_d4 = parseFloat(document.getElementById('cell_d4').value || 0)
    var cell_c5 = parseFloat(document.getElementById('cell_c5').value || 0)
    var cell_d5 = parseFloat(document.getElementById('cell_d5').value || 0)
    var cell_c6 = parseFloat(document.getElementById('cell_c6').value || 0)
    var cell_d6 = parseFloat(document.getElementById('cell_d6').value || 0)
    var cell_c8 = parseFloat(document.getElementById('cell_c8').value || 0)
    var cell_d8 = parseFloat(document.getElementById('cell_d8').value || 0)

    var cell_c3Purple = parseFloat(document.getElementById('cell_c3Purple').value || 0)
    var cell_d3Purple = parseFloat(document.getElementById('cell_d3Purple').value || 0)
    var cell_c5Purple = parseFloat(document.getElementById('cell_c5Purple').value || 0)
    var cell_d5Purple = parseFloat(document.getElementById('cell_d5Purple').value || 0)


    let validationFlag = false
    if(cell_c3 < cell_c5){
        document.getElementById('FlatKErrorRE').style.display = "block"
        document.getElementById('STEEPKErrorRE').style.display = "block"
        if(cell_c3Purple > cell_c5Purple){
            document.getElementById('FlatKErrorRE_Dioptre').style.display = "block"
            document.getElementById('STEEPKErrorRE_Diopter').style.display = "block"
        }
        validationFlag = true
    }else{
        document.getElementById('FlatKErrorRE').style.display = "none"
        document.getElementById('FlatKErrorRE_Dioptre').style.display = "none"
        document.getElementById('STEEPKErrorRE').style.display = "none"
        document.getElementById('STEEPKErrorRE_Diopter').style.display = "none"
    }
    if(cell_d3 < cell_d5){
        document.getElementById('FlatKErrorLE').style.display = "block"
        document.getElementById('STEEPKErrorLE').style.display = "block"
        if(cell_d3Purple > cell_d5Purple){
            document.getElementById('FlatKErrorLE_Dioptre').style.display = "block"
            document.getElementById('STEEPKErrorLE_Diopter').style.display = "block"
        }
        validationFlag = true
    }else{
        document.getElementById('FlatKErrorLE').style.display = "none"                          
        document.getElementById('FlatKErrorLE_Dioptre').style.display = "none"                          
        document.getElementById('STEEPKErrorLE').style.display = "none"
        document.getElementById('STEEPKErrorLE_Diopter').style.display = "none"
    }
    
    if(validationFlag){
        document.getElementById('validationFlatSteepK').style.display = "block"
        document.getElementById('calculateButton').disabled = true
    }else{
        document.getElementById('validationFlatSteepK').style.display = "none"
        document.getElementById('calculateButton').disabled = false
    }

    var cell_c7 = (cell_c3 + cell_c5) / 2;
    document.getElementById('cell_c7').innerHTML = valueFormat(cell_c7)

    var cell_d7 = (cell_d3 + cell_d5) / 2;
    document.getElementById('cell_d7').innerHTML = valueFormat(cell_d7)

    var cell_j3 = (cell_c3/1000)
    var cell_k3 = (cell_d3/1000)
    document.getElementById('cell_j3').innerHTML = (cell_j3).toFixed(4)
    document.getElementById('cell_k3').innerHTML = (cell_k3).toFixed(4)

    

    var cell_j5 = (cell_c5/1000).toFixed(4)
    var cell_k5 = (cell_d5/1000).toFixed(4)
    document.getElementById('cell_j5').innerHTML = cell_j5
    document.getElementById('cell_k5').innerHTML = cell_k5

    var cell_j7 = (cell_c7/1000).toFixed(4)
    var cell_k7 = (cell_d7/1000).toFixed(4)
    document.getElementById('cell_j7').innerHTML = cell_j7
    document.getElementById('cell_k7').innerHTML = cell_k7
    
    var cell_g3 = (!isFinite(((1.3375-1)/cell_j3))) ? 0 : mRound(((1.3375-1)/cell_j3),0.25);
    document.getElementById('cell_g3').innerHTML = valueFormat(cell_g3)
    
    var cell_h3 = (!isFinite(((1.3375-1)/cell_k3))) ? 0 : mRound(((1.3375-1)/cell_k3),0.25);
    document.getElementById('cell_h3').innerHTML = valueFormat(cell_h3)
    
    
    var cell_g4 = cell_c4
    var cell_h4 = cell_d4

    document.getElementById('cell_g4').innerHTML = valueFormat(cell_g4,'degree')
    document.getElementById('cell_h4').innerHTML = valueFormat(cell_h4,'degree')

    var cell_g5 = (!isFinite(((1.3375-1)/ cell_j5))) ? 0 : mRound(((1.3375-1)/ cell_j5),0.5);
    var cell_h5 = (!isFinite(((1.3375-1)/ cell_k5))) ? 0 : mRound(((1.3375-1)/ cell_k5),0.5);

    document.getElementById('cell_g5').innerHTML = valueFormat(cell_g5)
    document.getElementById('cell_h5').innerHTML = valueFormat(cell_h5)

    var cell_g6 = cell_c6
    var cell_h6 = cell_d6

    document.getElementById('cell_g6').innerHTML = valueFormat(cell_g6,'degree')
    document.getElementById('cell_h6').innerHTML = valueFormat(cell_h6,'degree')

    var temp_cell_g7 = ((cell_g5 - cell_g3) >= 0) ? -(cell_g5 - cell_g3) : (cell_g5 - cell_g3)
    var temp_cell_h7 = ((cell_h5 - cell_h3) >= 0) ? -(cell_h5 - cell_h3) : (cell_h5 - cell_h3)
    var cell_g7 = mRound(temp_cell_g7,0.25)
    var cell_h7 = mRound(temp_cell_h7,0.25)

    document.getElementById('cell_g7').innerHTML = valueFormat(cell_g7)
    document.getElementById('cell_h7').innerHTML = valueFormat(cell_h7)

    var cell_g8 = ((parseFloat(cell_g3) + parseFloat(cell_g5)) / 2)
    var cell_h8 = ((parseFloat(cell_h3) + parseFloat(cell_h5)) / 2)

    document.getElementById('cell_g8').innerHTML = valueFormat(cell_g8)
    document.getElementById('cell_h8').innerHTML = valueFormat(cell_h8)

    
    document.getElementById('cell_c7Purple').innerHTML = valueFormat(cell_g8)
    document.getElementById('cell_d7Purple').innerHTML = valueFormat(cell_h8)


    var cell_g17 = cell_g8
    document.getElementById('cell_g17').innerHTML = valueFormat(cell_g17)

    var cell_h17 = cell_h8
    document.getElementById('cell_h17').innerHTML = valueFormat(cell_h17)

    var cell_c11 = parseFloat(document.getElementById('cell_c11').value);
    var cell_d11 = parseFloat(document.getElementById('cell_d11').value);

    var cell_g18 = (cell_g3 - cell_g8) + cell_c11
    document.getElementById('cell_g18').innerHTML = (mRound(cell_g18,0.25)).toFixed(2)
    
    var cell_h18 = (cell_h3 - cell_h8) + cell_d11
    document.getElementById('cell_h18').innerHTML = (mRound(cell_h18,0.25)).toFixed(2)

    var cell_g_std_cyl = cell_g7
    var cell_h_std_cyl = cell_h7
    document.getElementById('cell_g_std_cyl').innerHTML = valueFormat(cell_g_std_cyl)
    document.getElementById('cell_h_std_cyl').innerHTML = valueFormat(cell_h_std_cyl)

    var cell_g19 = cell_c8
    var cell_h19 = cell_d8
    document.getElementById('cell_g19').innerHTML = valueFormat(cell_g19)
    document.getElementById('cell_h19').innerHTML = valueFormat(cell_h19)

    var cell_g20 = (cell_g3 - (-1 * cell_g18)).toFixed(2)
    document.getElementById('cell_g20').innerHTML = cell_g20
    
    var cell_h20 = (cell_h3 - (-1 * cell_h18)).toFixed(2)
    document.getElementById('cell_h20').innerHTML = cell_h20
            

    document.getElementById('screening_result_RE').innerHTML = cell_g20
    document.getElementById('screening_result_LE').innerHTML = cell_h20
    if(parseFloat(cell_g20) >= 39){
        document.getElementById('screening_result_suitability_RE').innerHTML = "Yes"
        document.getElementById('screening_result_suitability_RE').style.backgroundColor = '#76cd26'
        document.getElementById('screening_result_reason_RE').innerHTML = " => 39.00 "
        document.getElementById('screening_result_reason_RE').style.backgroundColor = '#76cd26'
    }else{
        document.getElementById('screening_result_suitability_RE').innerHTML = "No"
        document.getElementById('screening_result_suitability_RE').style.backgroundColor = 'red'
        document.getElementById('screening_result_reason_RE').innerHTML = " < 39.00 "
        document.getElementById('screening_result_reason_RE').style.backgroundColor = 'red'
    }
    if(parseFloat(cell_h20) >= 39){
        document.getElementById('screening_result_suitability_LE').innerHTML = "Yes"        
        document.getElementById('screening_result_suitability_LE').style.backgroundColor = '#76cd26'
        document.getElementById('screening_result_reason_LE').innerHTML = " => 39.00 "
        document.getElementById('screening_result_reason_LE').style.backgroundColor = '#76cd26'
    }else{
        document.getElementById('screening_result_suitability_LE').innerHTML = "No"
        document.getElementById('screening_result_suitability_LE').style.backgroundColor = 'red'
        document.getElementById('screening_result_reason_LE').innerHTML = " < 39.00 "
        document.getElementById('screening_result_reason_LE').style.backgroundColor = 'red'
    }

    var cell_c17 = mRound(cell_g17, 0.25);
    var cell_d17 = mRound(cell_h17, 0.25);

    document.getElementById('cell_c17').innerHTML = valueFormat(cell_c17)
    document.getElementById('cell_d17').innerHTML = valueFormat(cell_d17)

    var cell_c18 = mRound(cell_g18, 0.25).toFixed(2);
    var cell_d18 = mRound(cell_h18, 0.25).toFixed(2);
    document.getElementById('cell_c18').innerHTML = cell_c18
    document.getElementById('cell_d18').innerHTML = cell_d18

    var cell_c19 = cell_c8
    var cell_d19 = cell_d8

    document.getElementById('cell_c19').innerHTML = valueFormat(cell_c19)
    document.getElementById('cell_d19').innerHTML = valueFormat(cell_d19)

    var cell_g23 = cell_g17
    var cell_h23 = cell_h17
    document.getElementById('cell_g23').innerHTML = valueFormat(cell_g23)
    document.getElementById('cell_h23').innerHTML = valueFormat(cell_h23)

    var cell_g24 = cell_g18
    var cell_h24 = cell_h18
    document.getElementById('cell_g24').innerHTML = (mRound(cell_g24,0.25)).toFixed(2) 
    document.getElementById('cell_h24').innerHTML = (mRound(cell_h24,0.25)).toFixed(2) 

    var cell_g_hd_cyl = cell_g7
    var cell_h_hd_cyl = cell_h7
    document.getElementById('cell_g_hd_cyl').innerHTML = valueFormat(cell_g_hd_cyl)
    document.getElementById('cell_h_hd_cyl').innerHTML = valueFormat(cell_h_hd_cyl)

    var cell_g25 = cell_g19
    var cell_h25 = cell_h19
    document.getElementById('cell_g25').innerHTML = valueFormat(cell_g25)
    document.getElementById('cell_h25').innerHTML = valueFormat(cell_h25)

    var cell_g26 = cell_g20
    var cell_h26 = cell_h20
    document.getElementById('cell_g26').innerHTML = valueFormat(cell_g26)
    document.getElementById('cell_h26').innerHTML = valueFormat(cell_h26)

    var cell_c23 =  mRound(cell_g23, 0.25)
    var cell_d23 =  mRound(cell_h23, 0.25)
    document.getElementById('cell_c23').innerHTML = valueFormat(cell_c23)
    document.getElementById('cell_d23').innerHTML = valueFormat(cell_d23)

    var cell_c24 = mRound(cell_g24, 0.25).toFixed(2)
    var cell_d24 = mRound(cell_h24, 0.25).toFixed(2)

    // New Condition Starts
    if(cell_g3 == cell_g5){
        cell_c24 = -4.25
    }
    if(cell_h3 == cell_h5){
        cell_d24 = -4.25
    }
    // New Condition End

    document.getElementById('cell_c24').innerHTML = valueFormat(cell_c24)
    document.getElementById('cell_d24').innerHTML = valueFormat(cell_d24)

    var cell_c25 = cell_c8
    var cell_d25 = cell_c8
    document.getElementById('cell_c25').innerHTML = valueFormat(cell_c25)
    document.getElementById('cell_d25').innerHTML = valueFormat(cell_d25)

    var cell_g29 = cell_g3;
    var cell_h29 = cell_h3;
    document.getElementById('cell_g29').innerHTML = valueFormat(cell_g29)
    document.getElementById('cell_h29').innerHTML = valueFormat(cell_h29)

    var cell_g30 = cell_c11
    var cell_h30 = cell_d11
    document.getElementById('cell_g30').innerHTML = (mRound(cell_g30,0.25)).toFixed(2)
    document.getElementById('cell_h30').innerHTML = (mRound(cell_h30,0.25)).toFixed(2)

    var cell_g31 = cell_g7
    document.getElementById('cell_g31').innerHTML = valueFormat(cell_g31)

    var cell_h31 = cell_h7
    document.getElementById('cell_h31').innerHTML = valueFormat(cell_h31)

    var cell_g32 = cell_c8
    var cell_h32 = cell_d8

    document.getElementById('cell_g32').innerHTML = valueFormat(cell_g32)
    document.getElementById('cell_h32').innerHTML = valueFormat(cell_h32)


    var cell_g33 = cell_g7
    var cell_h33 = cell_h7

    document.getElementById('cell_g33').innerHTML = valueFormat(cell_g33)
    document.getElementById('cell_h33').innerHTML = valueFormat(cell_h33)

    // var cell_g34 = (cell_g3 - (-1 * cell_c11)).toFixed(2)
    // var cell_h34 = (cell_h3 - (-1 * cell_d11)).toFixed(2)
    var cell_g34 = cell_g20
    var cell_h34 = cell_h20

    document.getElementById('cell_g34').innerHTML = valueFormat(cell_g34)
    document.getElementById('cell_h34').innerHTML = valueFormat(cell_h34)

    var cell_c29 = mRound(cell_g29, 0.25);
    document.getElementById('cell_c29').innerHTML = valueFormat(cell_c29)

    var cell_d29 = mRound(cell_h29, 0.25);
    document.getElementById('cell_d29').innerHTML = valueFormat(cell_d29)

    var cell_c30 = cell_c11
    var cell_d30 = cell_d11

    document.getElementById('cell_c30').innerHTML = (mRound(cell_c30,0.25)).toFixed(2)
    document.getElementById('cell_d30').innerHTML = (mRound(cell_d30,0.25)).toFixed(2)

    cell_c31 = mRound(cell_g7,0.5)
    cell_d31 = mRound(cell_h7,0.5)
    var result_cell_c31 = ''
    var allowedValues = ['-1.00', '-1.50', '-2.00', '-2.50', '-3.00'];
    if (cell_c31 == '-1.00' || cell_c31 == '-1.50' || cell_c31 == '-2.00' || cell_c31 == '-2.50' ||  cell_c31 == '-3.00') {
        result_cell_c31 = valueFormat(cell_c31);
        document.getElementById('cell_c31').style.backgroundColor = '#76cd26'
    } else {
        result_cell_c31 = "Out of range";
        document.getElementById('cell_c31').style.backgroundColor = 'red'
    }

    var result_cell_d31 = ""
    if (cell_d31 == '-1.00' || cell_d31 == '-1.50' || cell_d31 == '-2.00' || cell_d31 == '-2.50' || cell_d31 == '-3.00') {
        result_cell_d31 = valueFormat(cell_d31);
        document.getElementById('cell_d31').style.backgroundColor = '#76cd26'
    } else {
        result_cell_d31 = "Out of range";
        document.getElementById('cell_d31').style.backgroundColor = 'red'
        
    }

    

    document.getElementById('cell_c31').innerHTML = result_cell_c31
    document.getElementById('cell_d31').innerHTML = result_cell_d31

    

    var cell_c32 = cell_c8
    var cell_d32 = cell_d8

    document.getElementById('cell_c32').innerHTML = valueFormat(cell_c32)
    document.getElementById('cell_d32').innerHTML = valueFormat(cell_d32)


    var result_cell_c37
    if(parseFloat(cell_g34) >= 39){
        if (cell_c30 > 8.00 && cell_c31 > -3.00) {
            result_cell_c37 = "Not suitable";
            document.getElementById('cell_c37').style.backgroundColor = 'red'
        }else if(document.getElementById('cell_c31').innerHTML == "Out of range"){
            result_cell_c37 = "Not suitable";
            document.getElementById('cell_c37').style.backgroundColor = 'red'
        } else {
            result_cell_c37 = "Suitable";
            document.getElementById('cell_c37').style.backgroundColor = '#76cd26'
        }
    }else{
        result_cell_c37 = "Not suitable";
        document.getElementById('cell_c37').style.backgroundColor = 'red'
    }


    var result_cell_d37
    if(parseFloat(cell_h34) >= 39){
        if (cell_d30 > 8.00 && cell_d31 > -3.00) {
            result_cell_d37 = "Not suitable";
            document.getElementById('cell_d37').style.backgroundColor = 'red'
        }else if(document.getElementById('cell_d31').innerHTML == "Out of range"){
            result_cell_d37 = "Not suitable";
            document.getElementById('cell_d37').style.backgroundColor = 'red'
        } else {
            result_cell_d37 = "Suitable";
            document.getElementById('cell_d37').style.backgroundColor = '#76cd26'
        }
    }else{
        result_cell_d37 = "Not suitable";
        document.getElementById('cell_d37').style.backgroundColor = 'red'
    }
    

    document.getElementById('cell_c37').innerHTML = result_cell_c37
    document.getElementById('cell_d37').innerHTML = result_cell_d37


    var cell_c38_rea = ''
    if(result_cell_c37 == 'Suitable'){
        cell_c38_rea = 'Within range'
        document.getElementById('cell_c38').style.backgroundColor = '#76cd26'
    }
    else{
        cell_c38_rea = 'Out of range'
        document.getElementById('cell_c38').style.backgroundColor = 'red'
    }

    var cell_d38_rea = ''
    if(result_cell_d37 == 'Suitable'){
        cell_d38_rea = 'Within range'
         document.getElementById('cell_d38').style.backgroundColor = '#76cd26'
    }
    else{
        cell_d38_rea = 'Out of range'
        document.getElementById('cell_d38').style.backgroundColor = 'red'
    }

    document.getElementById('cell_c38').innerHTML = cell_c38_rea
    document.getElementById('cell_d38').innerHTML = cell_d38_rea


    // 



    // MAKE CONDITION

    if(cell_c18 == -4.00){
        document.getElementById('green_table').style.display = 'none'
        document.getElementById('green_table_part2').style.display = 'none'
    }
    else{
        document.getElementById('green_table').style.display = 'revert'
        document.getElementById('green_table_part2').style.display = 'revert'
    }

    // MAKE CONDITION




    // updated Excel Sheet TP Cond For Suitable


    // Blue Table TP condition
    var TP = cell_c18
    var cell_c22_sut = '';
    var cell_d22_sut = '';

    if(parseFloat(cell_g20) >= 39){
        if (TP <= -8.00 || parseFloat(cell_g7) < -0.75 || parseFloat(cell_g7) > -0.25) {
           cell_c22_sut = 'Not suitable'
           document.getElementById('cell_c22_sut').style.backgroundColor = 'red'
        } else{
            cell_c22_sut = 'Suitable'
            document.getElementById('cell_c22_sut').style.backgroundColor = '#76cd26'
        }
    }else{
        cell_c22_sut = 'Not suitable'
        document.getElementById('cell_c22_sut').style.backgroundColor = 'red'
    }

    if(parseFloat(cell_h20) >= 39){
        if (cell_d18 <= -8.00 || parseFloat(cell_h7) < -0.75 || parseFloat(cell_h7) > -0.25) {        // cell_d18 is Tp2
            cell_d22_sut = 'Not suitable'
            document.getElementById('cell_d22_sut').style.backgroundColor = 'red'
        } else {
            cell_d22_sut = 'Suitable'
            document.getElementById('cell_d22_sut').style.backgroundColor = '#76cd26'
        }
    }else{
        cell_d22_sut = 'Not suitable'
        document.getElementById('cell_d22_sut').style.backgroundColor = 'red'
    }

    var cell_c23_rea = ''
    if(cell_c22_sut == 'Suitable'){
        // cell_c23_rea = 'Within range up to -8.00'
        cell_c23_rea = 'Within range'
        document.getElementById('cell_c23_rea').style.backgroundColor = '#76cd26'
    }
    else{
        cell_c23_rea = 'Out of range'
        document.getElementById('cell_c23_rea').style.backgroundColor = 'red'
    }

    var cell_d23_rea = ''
    if(cell_d22_sut == 'Suitable'){
        // cell_d23_rea = 'Within range up to -8.00'
        cell_d23_rea = 'Within range'
        document.getElementById('cell_d23_rea').style.backgroundColor = '#76cd26'
    }
    else{
        cell_d23_rea = 'Out of range'
        document.getElementById('cell_d23_rea').style.backgroundColor = 'red'
    }
    document.getElementById('cell_c22_sut').innerHTML = cell_c22_sut
    document.getElementById('cell_d22_sut').innerHTML = cell_d22_sut

    document.getElementById('cell_c23_rea').innerHTML = cell_c23_rea
    document.getElementById('cell_d23_rea').innerHTML = cell_d23_rea
    

    // Blue Table TP condition






    // Purple Table TP condition
    
    var cell_c29_sut = ''

    if(parseFloat(cell_g26) >= 39){
        if (cell_c24 <= -4.245 && cell_c24 >= -8.00) {    // cell_c24 is TP
            cell_c29_sut = "Suitable"
            document.getElementById('cell_c29_sut').style.backgroundColor = '#76cd26'
        } else {
            cell_c29_sut = "Not suitable"
            document.getElementById('cell_c29_sut').style.backgroundColor = 'red'
        }

        if(parseFloat(cell_g7) < -0.75 || parseFloat(cell_g7) > -0.25){
            cell_c29_sut = "Not suitable"
            document.getElementById('cell_c29_sut').style.backgroundColor = 'red'
        }

    }else{
        cell_c29_sut = "Not suitable"
        document.getElementById('cell_c29_sut').style.backgroundColor = 'red'
    }
    

    var cell_d29_sut = ''
    if(parseFloat(cell_h26) >= 39){
        if (cell_d24 <= -4.245 && cell_d24 >= -8.00) {    // cell_d24 is TP
            cell_d29_sut = "Suitable"
            document.getElementById('cell_d29_sut').style.backgroundColor = '#76cd26'
        } else {
            cell_d29_sut = "Not suitable"
            document.getElementById('cell_d29_sut').style.backgroundColor = 'red'
        }
    
        if(parseFloat(cell_h7) < -0.75 || parseFloat(cell_h7) > -0.25){
            cell_d29_sut = "Not suitable"
            document.getElementById('cell_d29_sut').style.backgroundColor = 'red'
        }
    }else{
        cell_d29_sut = "Not suitable"
        document.getElementById('cell_d29_sut').style.backgroundColor = 'red'
    }
    

    document.getElementById('cell_c29_sut').innerHTML = cell_c29_sut
    document.getElementById('cell_d29_sut').innerHTML = cell_d29_sut


    var cell_c30_rea = ''
    if(cell_c29_sut == 'Suitable'){
        cell_c30_rea = 'Within range'
        document.getElementById('cell_c30_rea').style.backgroundColor = '#76cd26'
    }
    else{
        cell_c30_rea = 'Out of range'
        document.getElementById('cell_c30_rea').style.backgroundColor = 'red'
    }

    var cell_d30_rea = ''
    if(cell_d29_sut == 'Suitable'){
        cell_d30_rea = 'Within range'
        document.getElementById('cell_d30_rea').style.backgroundColor = '#76cd26'
    }
    else{
        cell_d30_rea = 'Out of range'
        document.getElementById('cell_d30_rea').style.backgroundColor = 'red'
    }

    document.getElementById('cell_c30_rea').innerHTML = cell_c30_rea
    document.getElementById('cell_d30_rea').innerHTML = cell_d30_rea
    // Purple Table TP condition

    if(displayResultFlag){
        jQuery('#hideResults').show();
    }
    



    // updated Excel Sheet TP Cond For Suitable
 
   
}

function valueFormat(value, method = "none") {

    if (!value) {
        return 0
    }else{
        value = parseFloat(value)
    }

    if (method == 'degree') {
        return value.toLocaleString("en", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    }
    else {
        return value.toLocaleString("en", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

}



function mRound(value, multiple) {
    return Math.round(value / multiple) * multiple;
}

function roundToNearest(value, multiple) {
    if (value < 0) {
        return -Math.round(Math.abs(value) / multiple) * multiple;
    } else {
        return Math.round(value / multiple) * multiple;
    }
}





function formatInputValue(event) {
    const input = event.target;
    let value = input.value;

    // Remove any non-numeric characters except decimal points
    value = value.replace(/[^0-9.]/g, '');

    // Convert the value to a number and ensure it's a valid number
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
        // Format the number to 2 decimal places
        input.value = numericValue.toFixed(2);
    } else {
        // If it's not a valid number, reset to empty or handle as needed
        input.value = '';
    }
}


// Attach the event listeners to all inputs with the class 'decimal-input'
document.querySelectorAll('.decimal-input').forEach(input => {
    input.addEventListener('change', formatInputValue);
    // input.addEventListener('input', formatInputValue);
});