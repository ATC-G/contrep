import { Image, Text } from "@react-pdf/renderer";
import { View } from "@react-pdf/renderer";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import logoSantander from "../../assets/images/santander.PNG";
import logoCotrep from "../../assets/images/cotrepLogo.PNG";
import moment from "moment";
import { Html } from "react-pdf-html";

function Reporte({ pdfData }) {
  console.log(pdfData);
  const html = `<html>
  <body>
    <style>
      p {
        margin-bottom: 0px!important;
        margin: 0px;
        font-size: 8px;
      }
    </style>
      ${pdfData?.extraInfo ?? ""}    
  </body>
</html>
`;
  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    logoSantander: {
      width: 100,
      height: 50,
    },
    logoCotrep: {
      width: 100,
      height: 45,
    },
    containerFlex: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    font7: {
      fontSize: "7px!important",
    },
  });
  const stylesTable = StyleSheet.create({
    table: {
      width: "100%",
      fontSize: 7,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      borderTop: "1px solid #777",
      paddingTop: 4,
      paddingBottom: 4,
    },
    header: {
      borderTop: "none",
    },
    bold: {
      fontWeight: "bold",
    },
    // So Declarative and unDRY 👌
    row1: {
      width: "20%",
    },
    row2: {
      width: "40%",
    },
    row3: {
      width: "15%",
    },
    row4: {
      width: "25%",
    },
  });

  const formatNumber = (number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    if (number) return formatter.format(number);
    return "$0.00";
  };
  const capitalizeFirstLetterOfEachWord = (sentence) => {
    var words = sentence.toLowerCase().split(" ");
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }
    return words.join(" ");
  };
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View style={{ ...styles.containerFlex }}>
          <Image style={styles.logoSantander} src={logoSantander} />
          <View
            style={{ textAlign: "center", display: "block", paddingTop: 35 }}
          >
            <Text style={{ fontSize: 10, margin: "auto" }}>
              Referencias de Pago {pdfData.ciclo}
            </Text>
            <Text style={{ fontSize: 10, margin: "auto", marginTop: 5 }}>
              Cueto Escolares S.A. de C.V.
            </Text>
            <Text style={{ fontSize: 10, margin: "auto", marginTop: 5 }}>
              {pdfData.colegio}
            </Text>
          </View>
          <Image style={styles.logoCotrep} src={logoCotrep} />
        </View>
        <View style={{ marginTop: 10, display: "block" }}>
          <Text style={{ fontSize: 10, fontWeight: 900 }}>
            Convenio: {pdfData.convenio}
          </Text>
        </View>
        <View style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 10, width: 150 }}>
            {pdfData.codigoFamilia}
          </Text>
          <Text style={{ fontSize: 10 }}>{pdfData.familia}</Text>
        </View>
        {pdfData.alumnos.map((al, idxA) => (
          <View
            key={`alumnos-${idxA}`}
            style={{ marginTop: 5, display: "flex", flexDirection: "row" }}
          >
            <Text style={{ fontSize: 10, width: 150 }}>{al.matricula}</Text>
            <Text style={{ fontSize: 10, width: 150 }}>
              {capitalizeFirstLetterOfEachWord(al.nombre)}
            </Text>
            <Text style={{ fontSize: 10 }}>{formatNumber(al.mensualidad)}</Text>
          </View>
        ))}
        <View style={[stylesTable.table, { marginTop: 10 }]}>
          <View style={[stylesTable.row, stylesTable.bold, stylesTable.header]}>
            <Text style={stylesTable.row1}>Mes</Text>
            <Text style={stylesTable.row2}>Concepto de Pago</Text>
            <Text style={stylesTable.row3}>Monto</Text>
            <Text style={stylesTable.row4}>Fecha Límite de Pago</Text>
          </View>
          {pdfData.referencias.map((itRef, idx) => (
            <View style={stylesTable.row} wrap={false} key={`ref-${idx}`}>
              <Text style={stylesTable.row1}>
                <Text style={stylesTable.bold}>{itRef.mes}</Text>
              </Text>
              <View style={stylesTable.row2}>
                {itRef.data.referenciaBancaria.map((itRefB, idxRefB) => (
                  <Text key={`refb-${idxRefB}`}>
                    {itRefB.referenciaBancaria}
                  </Text>
                ))}
              </View>
              <View style={stylesTable.row3}>
                {itRef.data.monto.map((itMonto, idxMonto) => (
                  <Text key={`refb-${idxMonto}`}>
                    {formatNumber(itMonto.monto)}
                  </Text>
                ))}
              </View>
              <View style={stylesTable.row4}>
                {itRef.data.fechaLimite.map((itFL, idxFL) => (
                  <Text key={`refb-${idxFL}`}>
                    {moment(itFL.fechaLimite, "YYYY-MM-DD").format(
                      "DD/MM/YYYY"
                    )}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
        <View style={{ marginTop: 15, display: "block" }}>
          <Html>{html}</Html>
        </View>
      </Page>
    </Document>
  );
}

export default Reporte;
