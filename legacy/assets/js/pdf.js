function downloadPDF(conditionCheck) {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();
  
    const currentDate = `${month}-${day}-${year}`;
  
    let tableWidth = 180;
    let tableWidthCalc = 0;
    if (conditionCheck == true) {
      tableWidth = 90;
      tableWidthCalc = 90;
    }
  
    let tableStyling = {
      fontSize: 7,
      overflow: "linebreak",
      cellWidth: "",
      overflowColumns: "linebreak",
      cellPadding: 0.5,
      minCellHeight: 6,
      lineColor: 200,
      fillColor: true,
      textColor: 20,
      valign: "middle",
      halign: "center",
      lineColor: [50, 102, 175], // Border color
      lineWidth: 0.5,
    };
    let tableHeadStyling = {
      theme: "grid",
      fillColor: [240, 249, 255],
      fontSize: 7,
      textColor: [50, 102, 175],
      cellPadding: 1,
      valign: "middle",
      halign: "center",
    };
    let fontBoldTBody = {
      fontStyle: "bold",
      fontSize: 7,
      fillColor: [240, 249, 255],
      textColor: [50, 102, 175],
    };
    let fontNormalTBody = {
      fontStyle: "normal",
      fontSize: 7,
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    };
  
    var width55or105 = 105;
    if (conditionCheck) {
      width55or105 = 55;
    }
  
    var doc = new jsPDF("p", "mm", "a4");
    var x = 12;
    var y = 12;
  
    doc.addImage(imgLogo, "jpg", x + 150, y - 12, 40, 18);
    // doc.addImage(imageLogo, 'JPEG', x, y, 180, 18);
    doc.setDrawColor(222, 222, 222);
    doc.line(0, 18, 210, 18);
  
    doc.setTextColor(42, 81, 147);
    doc.setFontType("normal");
    doc.setFontSize(16);
    doc.text(x, y - 3, "BOQ Report");
    doc.setTextColor(42, 81, 147);
    doc.setFontType("normal");
    doc.setFontSize(8);
    doc.text(x, y + 1, currentDate);
  
    y += 12;
    doc.setTextColor(179, 138, 76);
    doc.setFontType("bold");
    doc.setFontSize(10);
    doc.text(12, y, "INSTRUCTIONS");
    y += 4;
    doc.setFontSize(8);
    doc.text(12, y, "The BOC Calculator is to be used with");
    y += 5;
    doc.setFontType("Bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(12, y, doc.splitTextToSize("STEP 1: Please key in the eye keratometry data , the Flat K and Steep K either in mm or diopter , then select your closest diameter ( *Closest diameter selection is based on 95% of HVID)", 186));
    y += 8;
    doc.text(12, y, "STEP 2: Please key in the spectacle refraction data.The click [Calculate]");
    
    y += 8;
    
    doc.setTextColor(179, 138, 76);
    doc.setFontType("bold");
    doc.setFontSize(11);
    doc.text(55, y, "KERATOMETRY INFORMATION (MM/D)", "center");
  
    doc.text(150, y-8, "REFRACTION POWER (Dioptre)", "center");
  
    doc.autoTable({
      startY: y + 2,
      startX: 12,
      margin: { top: 0, left: 12, bottom: 0, right: 5 },
      tableWidth: 90,
      cellWidth: "wrap",
      showHead: "everyPage",
  
      styles: tableStyling,
      head: [
        [
          "",
          { content: "RE (OD)", colSpan: 2 },
          { content: "LE (OS)", colSpan: 2 },
        ],
        ["FC or BC (mm)", "BC (mm)", "Dioptre (D)", "BC (mm)", "Dioptre (D)"],
      ],
  
      headStyles: tableHeadStyling,
      columnStyles: {
        0: { cellWidth: 30 },
      },
      body: [
        [
          {
            content: "Flat K",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c3").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c3Purple").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d3").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d3Purple").value
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Flat K Axis",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c4").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: "",
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d4").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: "",
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Steep K",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c5").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c5Purple").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d5").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d5Purple").value
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Steep K Axis",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c6").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: "",
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d6").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: "",
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Average K",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c7").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c7Purple").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d7").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d7Purple").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Closest Diameter",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c8").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: "",
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d8").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: "",
            styles: fontNormalTBody,
          },
        ],
      ],
    });
  
    doc.autoTable({
      startY: y - 6,
      startX: 108,
      margin: { top: 0, left: 108, bottom: 0, right: 5 },
      tableWidth: 90,
      cellWidth: "wrap",
      showHead: "everyPage",
  
      styles: tableStyling,
      head: [["Refraction", "RE (OD)", "LE (OS) "]],
  
      headStyles: tableHeadStyling,
      columnStyles: {
        0: { cellWidth: 30 },
      },
      body: [
        [
          {
            content: "Sphere",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c11").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d11").value
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Cylinder",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c12").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d12").value
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Axis",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c13").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d13").value
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "VA",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c14").value
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d14").value
            ),
            styles: fontNormalTBody,
          },
        ],
      ],
    });
  
    // doc.setFontSize(8);
    // doc.text(150, y + 25, "Shape of Cornea Effectiveness (Flattest K -Target Power)", "center");
  
    var screening_result_suitability_RE =
      document.getElementById("screening_result_suitability_RE").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("screening_result_suitability_RE").style.backgroundColor;
    var screening_result_suitability_LE =
      document.getElementById("screening_result_suitability_LE").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("screening_result_suitability_LE").style.backgroundColor;
    var screening_result_reason_RE =
      document.getElementById("screening_result_reason_RE").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("screening_result_reason_RE").style.backgroundColor;
    var screening_result_reason_LE =
      document.getElementById("screening_result_reason_LE").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("screening_result_reason_LE").style.backgroundColor;
  
    doc.autoTable({
      startY: y + 25,
      startX: 108,
      margin: { top: 0, left: 108, bottom: 0, right: 5 },
      tableWidth: 90,
      cellWidth: "wrap",
      showHead: "everyPage",
  
      styles: tableStyling,
      head: [["Shape of Cornea Effectiveness", "RE (OD)", "LE (OS) "]],
  
      headStyles: tableHeadStyling,
      columnStyles: {
        0: { cellWidth: 30 },
      },
      body: [
        [
          {
            content: "Screening => 39",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("screening_result_RE").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("screening_result_LE").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Suitability",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("screening_result_suitability_RE").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${screening_result_suitability_RE}`],
              textColor: [0, 0, 0],
            },
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("screening_result_suitability_LE").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${screening_result_suitability_LE}`],
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Reason",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              (document.getElementById("screening_result_reason_RE").innerHTML).includes('&gt;') ? "=> 39.00" : "< 39.00"
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${screening_result_reason_RE}`],
              textColor: [0, 0, 0],
            },
          },
          {
            content: doc.splitTextToSize(
              (document.getElementById("screening_result_reason_LE").innerHTML).includes('&gt;') ? "=> 39.00" : "< 39.00"
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${screening_result_reason_LE}`],
              textColor: [0, 0, 0],
            },
          },
        ],
      ],
    });
  
    y += 56;
    doc.setTextColor(179, 138, 76);
    doc.setFontType("bold");
    doc.setFontSize(11);
    doc.text(width55or105, y, "KERATOMETRY INFORMATION (Dioptre)", "center");
  
    if (conditionCheck) {
      doc.setTextColor(179, 138, 76);
      doc.setFontType("bold");
      doc.setFontSize(11);
      doc.text(150, y, "KERATOMETRY INFORMATION (Metre)", "center");
    }
    x += 15;
    y += 0;
    // var breakLIne = doc.splitTextToSize('Study Time in HH:MM (when studying 2 hours a day for 4 weeks)', 50)
  
    var cell_c22_sut =
      document.getElementById("cell_c22_sut").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_c22_sut").style.backgroundColor;
    var cell_d22_sut =
      document.getElementById("cell_d22_sut").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_d22_sut").style.backgroundColor;
    var cell_c23_rea =
      document.getElementById("cell_c23_rea").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_c23_rea").style.backgroundColor;
    var cell_d23_rea =
      document.getElementById("cell_d23_rea").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_d23_rea").style.backgroundColor;
    var cell_c29_sut =
      document.getElementById("cell_c29_sut").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_c29_sut").style.backgroundColor;
    var cell_d29_sut =
      document.getElementById("cell_d29_sut").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_d29_sut").style.backgroundColor;
    var cell_c30_rea =
      document.getElementById("cell_c30_rea").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_c30_rea").style.backgroundColor;
    var cell_d30_rea =
      document.getElementById("cell_d30_rea").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_d30_rea").style.backgroundColor;
    var cell_c31 =
      document.getElementById("cell_c31").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_c31").style.backgroundColor;
    var cell_d31 =
      document.getElementById("cell_d31").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_d31").style.backgroundColor;
    var cell_c37 =
      document.getElementById("cell_c37").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_c37").style.backgroundColor;
    var cell_d37 =
      document.getElementById("cell_d37").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_d37").style.backgroundColor;
    var cell_c38 =
      document.getElementById("cell_c38").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_c38").style.backgroundColor;
    var cell_d38 =
      document.getElementById("cell_d38").style.backgroundColor == ""
        ? "#FFFFFF"
        : document.getElementById("cell_d38").style.backgroundColor;
  
    doc.autoTable({
      startY: y + 2,
      startX: 12,
      margin: { top: 0, left: 12, bottom: 0, right: 5 },
      tableWidth: tableWidth,
      cellWidth: "wrap",
      showHead: "everyPage",
  
      styles: tableStyling,
      head: [["Fitting Curve (D)", "RE (OD)", "LE (OS) "]],
  
      headStyles: tableHeadStyling,
      columnStyles: {
        0: { cellWidth: 30 },
      },
      body: [
        [
          {
            content: "Flat K",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_g3").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_h3").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Flat K Axis",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_g4").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_h4").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Steep K",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_g5").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_h5").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Steep K Axis",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_g6").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_h6").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Cylinder",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_g7").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_h7").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Ave K",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_g8").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_h8").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
      ],
    });
  
    if (conditionCheck == true) {
      doc.autoTable({
        startY: y + 2,
        startX: 108,
        margin: { top: 0, left: 108, bottom: 0, right: 0 },
        tableWidth: tableWidthCalc,
        cellWidth: "wrap",
        showHead: "everyPage",
  
        styles: tableStyling,
        head: [["Conversion", "RE (OD)", "LE (OS)"]],
  
        headStyles: tableHeadStyling,
        columnStyles: {
          0: { cellWidth: 30 },
        },
        body: [
          [
            {
              content: "Flat K",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_j3").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_k3").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "Steep K",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_j5").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_k5").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "Cylinder",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_j7").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_k7").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
        ],
      });
    }
  
    y += 50;
    doc.setTextColor(179, 138, 76);
    doc.setFontType("bold");
    doc.setFontSize(11);
    doc.text(width55or105, y, "BOC STD ( 1ST Trial Lens )", "center");
  
    doc.autoTable({
      startY: y + 2,
      startX: 12,
      margin: { top: 0, left: 12, bottom: 0, right: 5 },
      tableWidth: tableWidth,
      cellWidth: "wrap",
      showHead: "everyPage",
  
      styles: tableStyling,
      head: [["BOC SPHERE", "RE (OD)", "LE (OS) "]],
  
      headStyles: tableHeadStyling,
      columnStyles: {
        0: { cellWidth: 30 },
      },
      body: [
        [
          {
            content: "FT (Fitting Curve)",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c17").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d17").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "TP (Target Power)",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c18").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d18").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Closest Diameter (mm)",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c19").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d19").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Suitability",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c22_sut").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_c22_sut}`],
              textColor: [0, 0, 0],
            },
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d22_sut").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_d22_sut}`],
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Reason",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c23_rea").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_c23_rea}`],
              textColor: [0, 0, 0],
            },
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d23_rea").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_d23_rea}`],
              textColor: [0, 0, 0],
            },
          },
        ],
      ],
    });
  
    if (conditionCheck == true) {
      doc.autoTable({
        startY: y + 2,
        startX: 108,
        margin: { top: 0, left: 108, bottom: 0, right: 0 },
        tableWidth: tableWidthCalc,
        cellWidth: "wrap",
        showHead: "everyPage",
        styles: tableStyling,
        head: [["BOC SPHERE CALCULATION", "RE (OD)", "LE (OS)"]],
  
        headStyles: tableHeadStyling,
  
        body: [
          [
            {
              content: "FT : 39.00D ~ 47.00D (0.25D increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g17").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h17").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "TP : -1.00D ~ -4.00D (0.25D increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g18").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h18").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "CYL : -0.25/ -0.50 / -0.75 / -1.00 (0.25D increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g_std_cyl").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h_std_cyl").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "DIA 10.2/ 10.6 /11.0 (0.4mm increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g19").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h19").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "Screening => 39",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g20").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h20").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
        ],
      });
    }
  
    y += 44;
    doc.setTextColor(179, 138, 76);
    doc.setFontType("bold");
    doc.setFontSize(11);
    doc.text(width55or105, y, "BOC HD ( 1ST Trial Lens )", "center");
  
    doc.autoTable({
      startY: y + 2,
      startX: 12,
      margin: { top: 0, left: 12, bottom: 0, right: 5 },
      tableWidth: tableWidth,
      cellWidth: "wrap",
      showHead: "everyPage",
  
      styles: tableStyling,
      head: [["BOC HD SPHERE", "RE (OD)", "LE (OS) "]],
  
      headStyles: tableHeadStyling,
      columnStyles: {
        0: { cellWidth: 30 },
      },
      body: [
        [
          {
            content: "FT (Fitting Curve)",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c23").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d23").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "TP (Target Power)",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c24").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d24").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Closest Diameter (mm)",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c25").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d25").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Suitability",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c29_sut").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_c29_sut}`],
              textColor: [0, 0, 0],
            },
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d29_sut").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_d29_sut}`],
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Reason",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c30_rea").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_c30_rea}`],
              textColor: [0, 0, 0],
            },
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d30_rea").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_d30_rea}`],
              textColor: [0, 0, 0],
            },
          },
        ],
      ],
    });
  
    if (conditionCheck == true) {
      doc.autoTable({
        startY: y + 2,
        startX: 108,
        margin: { top: 0, left: 108, bottom: 0, right: 0 },
        tableWidth: tableWidthCalc,
        cellWidth: "wrap",
        showHead: "everyPage",
  
        styles: tableStyling,
        head: [["BOC HD SPHERE CALCULATION", "RE (OD)", "LE (OS)"]],
  
        headStyles: tableHeadStyling,
  
        body: [
          [
            {
              content: "FT : 39.00D ~ 47.00D (0.25D increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g23").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h23").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "TP : -4.25D ~ -8.00D (0.25D increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g24").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h24").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "CYL : -1.00/-1.50/-2.00/-2.50/-3.00 (0.50D increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g_hd_cyl").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h_hd_cyl").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "DIA 10.2/ 10.6 /11.0 (0.4mm increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g25").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h25").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "Screening => 39",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g26").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h26").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
        ],
      });
    }
  
    y += 41;
    doc.setTextColor(0, 0, 0);
    doc.setFontType("normal");
    doc.setFontSize(9);
    doc.text(12, y, "Those who have a high pressure on the cornea", "left");
    doc.text(12, y+3, "(Uncomfortable wear/onset of SPK)", "left");
  
    y += 9;
    doc.setTextColor(179, 138, 76);
    doc.setFontType("bold");
    doc.setFontSize(11);
    doc.text(width55or105, y, "BOC TD ( 1ST Trial Lens )", "center");
  
    doc.autoTable({
      startY: y + 2,
      startX: 12,
      margin: { top: 0, left: 12, bottom: 0, right: 5 },
      tableWidth: tableWidth,
      cellWidth: "wrap",
      showHead: "everyPage",
  
      styles: tableStyling,
      head: [["BOC TD", "RE (OD)", "LE (OS) "]],
  
      headStyles: tableHeadStyling,
      columnStyles: {
        0: { cellWidth: 30 },
      },
      body: [
        [
          {
            content: "FT (Fitting Curve)",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c29").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d29").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "TP (Target Power)",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c30").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d30").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "CYL (Cylinder)",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c31").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_c31}`],
              textColor: [0, 0, 0],
            },
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d31").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_d31}`],
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Closest Diameter (mm)",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c32").innerHTML
            ),
            styles: fontNormalTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d32").innerHTML
            ),
            styles: fontNormalTBody,
          },
        ],
        [
          {
            content: "Suitability",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c37").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_c37}`],
              textColor: [0, 0, 0],
            },
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d37").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_d37}`],
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Reason",
            styles: fontBoldTBody,
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_c38").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_c38}`],
              textColor: [0, 0, 0],
            },
          },
          {
            content: doc.splitTextToSize(
              document.getElementById("cell_d38").innerHTML
            ),
            styles: {
              fontStyle: "normal",
              fontSize: 8,
              fillColor: [`${cell_d38}`],
              textColor: [0, 0, 0],
            },
          },
        ],
      ],
    });
  
    if (conditionCheck == true) {
      doc.autoTable({
        startY: y + 2,
        startX: 108,
        margin: { top: 0, left: 108, bottom: 0, right: 0 },
        tableWidth: tableWidthCalc,
        cellWidth: "wrap",
        showHead: "everyPage",
  
        styles: tableStyling,
        head: [["BOC TD CALCULATION", "RE (OD)", "LE (OS)"]],
  
        headStyles: tableHeadStyling,
  
        body: [
          [
            {
              content: "FT : 39.00D ~ 47.00D (0.25D increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g29").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h29").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "TP : -1.00D ~ -8.00D (0.25D increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g30").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h30").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "CYL : -1.00/-1.50/-2.00/-2.50/-3.00 (0.50D increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g31").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h31").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "DIA 10.2/ 10.6 /11.0 (0.4mm increment)",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g32").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h32").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "Screening Cyl < 3.50",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g33").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h33").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
          [
            {
              content: "Screening => 39",
              styles: fontBoldTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_g34").innerHTML
              ),
              styles: fontNormalTBody,
            },
            {
              content: doc.splitTextToSize(
                document.getElementById("cell_h34").innerHTML
              ),
              styles: fontNormalTBody,
            },
          ],
        ],
      });
    }
  
    if (conditionCheck) {
      doc.save("bocdetails.pdf");
    } else {
      doc.save("bocsimple.pdf");
    }
  
    // window.open(doc.output('bloburl'))
  }
  
  const imgLogo =
    "data:image/jpeg;base64,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";