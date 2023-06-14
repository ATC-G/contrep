import { Image, Text } from "@react-pdf/renderer";
import { View } from "@react-pdf/renderer";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import logoSantander from '../../assets/images/santander.PNG'
import logoCotrep from '../../assets/images/cotrepLogo.PNG'
import moment from "moment";

function Reporte({pdfData}){
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
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    });
    const stylesTable = StyleSheet.create({
        table: {
          width: '100%',
          fontSize: 9.5
        },
        row: {
          display: 'flex',
          flexDirection: 'row',
          borderTop: '1px solid #777',
          paddingTop: 8,
          paddingBottom: 8,
        },
        header: {
          borderTop: 'none',
        },
        bold: {
          fontWeight: 'bold',
        },
        // So Declarative and unDRY 👌
        row1: {
          width: '20%',
        },
        row2: {
          width: '40%',
        },
        row3: {
          width: '15%',
        },
        row4: {
          width: '25%',
        },
    })

    const formatNumber = (number) => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          
            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        if(number) return formatter.format(number)
        return '';
    }

    return (
        <Document>
            <Page size="A4" style={styles.body}>
                <View style={{...styles.containerFlex}}>
                    <Image style={styles.logoSantander} src={logoSantander} />
                    <View style={{textAlign: 'center', display: 'block', paddingTop: 35}}>
                        <Text style={{fontSize: 10, margin: 'auto'}}>Referencias de Pago 2022-2023</Text>
                        <Text style={{fontSize: 10, margin: 'auto', marginTop: 5}}>Cueto Escolares S.A. de C.V.</Text>
                        <Text style={{fontSize: 10, margin: 'auto', marginTop: 5}}>Regina</Text>
                    </View>
                    <Image style={styles.logoCotrep} src={logoCotrep} />
                </View>
                <View style={{marginTop: 10, display: 'block'}}>
                    <Text style={{fontSize: 10, fontWeight: 900}}>Convenio: 00085903</Text>
                </View>
                <View style={{marginTop: 10, display: 'flex', flexDirection: 'row'}}>
                    <Text style={{fontSize: 10, width: 150}}>5</Text>
                    <Text style={{fontSize: 10}}>Chávez Estévez</Text>
                </View>
                {
                    pdfData.alumnos.map((al, idxA) => (
                    <View key={`alumnos-${idxA}`} style={{marginTop: 5, display: 'flex', flexDirection: 'row'}}>
                        <Text style={{fontSize: 10, width: 150}}></Text>
                        <Text style={{fontSize: 10, width: 150}}>{al.nombre}</Text>
                        <Text style={{fontSize: 10}}>{formatNumber(al.mensualidad)}</Text>
                    </View>
                    ))
                }

                <View style={[stylesTable.table, {marginTop: 10}]}>
                    <View style={[stylesTable.row, stylesTable.bold, stylesTable.header]}>
                        <Text style={stylesTable.row1}>Mes</Text>
                        <Text style={stylesTable.row2}>Concepto de Pago</Text>
                        <Text style={stylesTable.row3}>Monto</Text>
                        <Text style={stylesTable.row4}>Fecha Límite de Pago</Text>
                    </View>
                    {
                        pdfData.referencias.map((itRef, idx) => (
                            <View style={stylesTable.row} wrap={false} key={`ref-${idx}`}>
                                <Text style={stylesTable.row1}>
                                    <Text style={stylesTable.bold}>{itRef.mes}</Text>
                                </Text>
                                <View style={stylesTable.row2}>
                                    {
                                        itRef.referenciaBancaria.map((itRefB, idxRefB) => (
                                            <Text key={`refb-${idxRefB}`}>{itRefB.referenciaBancaria}</Text>
                                        ))
                                    }
                                </View>
                                <View style={stylesTable.row3}>
                                    {
                                        itRef.monto.map((itMonto, idxMonto) => (
                                            <Text key={`refb-${idxMonto}`}>{formatNumber(itMonto.monto)}</Text>
                                        ))
                                    }
                                </View>
                                <View style={stylesTable.row4}>
                                    {
                                        itRef.fechaLimite.map((itFL, idxFL) => (
                                            <Text key={`refb-${idxFL}`}>{moment(itFL.fechaLimite, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>
                                        ))
                                    }
                                </View>
                            </View>
                        ))
                    }
                </View>
            </Page>
        </Document>
    )
}

export default Reporte