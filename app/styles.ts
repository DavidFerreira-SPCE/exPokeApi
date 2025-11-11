import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ca1111de',
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
    },
    containerBody: {
        backgroundColor: '#969696ff',
        height: '90%',
        width: '80%',
        borderRadius: 32
    },
    logoDisplay: {
        flexDirection: 'row',
        justifyContent:'center',
        gap: 100,
        alignItems: 'center',
        width: '100%',
    },
    logo: {   
        resizeMode: 'contain',
        width: 90,
        height: 120,
    },
    texto: {
        padding: 12,
        margin: 10,
        display:'flex',
        backgroundColor: '#757575ff',
        color: 'yellow',
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: 'bold',
        justifyContent:'center',
        textAlign:'center',
        borderRadius:8
    },
    textoBusca: {
        backgroundColor: '#585633b4',
        color: '#e7e7e7ff',
        textAlign: 'center',
        width: 'auto',
        padding: 20,
        fontSize: 16,
        margin: 12,
        marginBottom: 10,
        borderRadius: 12
    },
    julio: {
        color:'white',
        fontSize: 16,
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#a01010ff',
        height: '90%',
        width: '50%',
        margin:'auto',
        padding: 10,
        borderRadius: 16
    },
})

export default styles