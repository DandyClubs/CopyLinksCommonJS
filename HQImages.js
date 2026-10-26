
const BASE_URLS = {
    "FANZA_DIGITAL": "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video", // 00001 
    "FANZA_MONO": "https://awsimgsrc.dmm.com/dig/mono/movie",              // raw 
    "PRESTIGE": "https://www.prestige-av.com/api/media/goods/prestige",    // raw
    "DMM_MONO": "https://pics.dmm.co.jp/mono/movie/adult",                 // raw
};

const DB_PREFIX_RULES = {
    "ABF": ["FANZA_MONO", "118"],

    // S1 NO.1 STYLE
    "SONE": ["FANZA_DIGITAL", ""],
    "SNOS": ["FANZA_DIGITAL", ""],

    // [Prestige 계열] - DMM_MONO는 MONO 로직을 따름
    "ABS": ["DMM_MONO", "118"],
    "ABP": ["DMM_MONO", "118"],
    "ABW": ["DMM_MONO", "118"],
    "EZD": ["DMM_MONO", "118"],
    "CHN": ["DMM_MONO", "118"],
    "FTN": ["DMM_MONO", "118"],
    "ABY": ["DMM_MONO", "118"],
    "DOM": ["DMM_MONO", "118"],
    "GVH": ["DMM_MONO", "13"],
    "GVG": ["DMM_MONO", "13"],
    "GG": ["DMM_MONO", "13"],

    // [ Madonna 계열 ]
    "JUR": ["FANZA_DIGITAL", ""],

    //  S級素人
    "SAMA": ["FANZA_DIGITAL", "h_244"],

    // IDEA POCKET (MONO지만 예외적으로 5자리를 쓰신다면 DIGITAL로 변경 권장, 
    // 혹은 MONO 로직대로 raw를 쓰신다면 유지)
    "IPZZ": ["FANZA_DIGITAL", ""],
    "IPZ": ["FANZA_DIGITAL", ""],

    // [DIGITAL 계열 - h_, n_] (자동으로 5자리 패딩 적용됨)
    "AMBI": ["FANZA_DIGITAL", "h_237"],
    "AMBS": ["FANZA_DIGITAL", "h_237"],
    "CLOT": ["FANZA_DIGITAL", "h_237"],
    "NACR": ["FANZA_DIGITAL", "h_237"],
    "ZMAR": ["FANZA_DIGITAL", "h_237"],
    "BANK": ["FANZA_DIGITAL", "h_1495"],
    "BUZ": ["FANZA_DIGITAL", "h_1340"],
    "CHUC": ["FANZA_DIGITAL", "h_491"],
    "CIEL": ["FANZA_DIGITAL", "h_491"],
    "NNNC": ["FANZA_DIGITAL", "h_491"],
    "DOCD": ["FANZA_DIGITAL", "h_1711"],
    "FCP": ["FANZA_DIGITAL", "h_1711"],
    "MFCT": ["FANZA_DIGITAL", "h_1711"],
    "EUUD": ["FANZA_DIGITAL", "h_086"],
    "JRZE": ["FANZA_DIGITAL", "h_086"],
    "JURA": ["FANZA_DIGITAL", "h_086"],
    "NUKA": ["FANZA_DIGITAL", "h_086"],
    "XMOM": ["FANZA_DIGITAL", "h_086"],
    "HZGD": ["FANZA_DIGITAL", "h_1100"],
    "JUKF": ["FANZA_DIGITAL", "h_227"],
    "MBDD": ["FANZA_DIGITAL", "n_707"],
    "MILK": ["FANZA_DIGITAL", "h_1240"],
    "ONEX": ["FANZA_DIGITAL", "h_1674"],
    "PJAB": ["FANZA_DIGITAL", "h_1604"],
    "REBD": ["FANZA_DIGITAL", "h_346"],
    "REBDB": ["FANZA_DIGITAL", "h_346"],
    "SKMJ": ["FANZA_DIGITAL", "h_1324"],
    "SS": ["FANZA_DIGITAL", "h_1231"],
    "STSK": ["FANZA_DIGITAL", "h_1605"],
    "HMRK": ["FANZA_DIGITAL", "h_1711"],
    "BEAF": ["FANZA_DIGITAL", "h_1615"],
    "GINAV": ["FANZA_DIGITAL", "h_1350"],
    "FCH": ["FANZA_DIGITAL", "h_1711"],
    "TENN": ["FANZA_DIGITAL", "h_491"],
    "PYM": ["FANZA_DIGITAL", "h_283"],
    "MAAN": ["FANZA_DIGITAL", "h_1711"],
    "INSTV": ["FANZA_DIGITAL", "h_1472"],

    // [기타 숫자형]
    "AD": ["FANZA_DIGITAL", "24"],
    "AKB": ["FANZA_DIGITAL", "55"],
    "ASEX": ["FANZA_DIGITAL", "1"],
    "BLD": ["FANZA_DIGITAL", "24"],
    "BOKO": ["FANZA_DIGITAL", "1"],
    "CAD": ["FANZA_DIGITAL", "24"],
    "CADV": ["FANZA_DIGITAL", "49"],
    "CPDE": ["FANZA_DIGITAL", "188"],
    "DFDM": ["FANZA_DIGITAL", "2"],
    "DLDSS": ["FANZA_DIGITAL", "1"],
    "DOCP": ["FANZA_DIGITAL", "118"],
    "ECB": ["FANZA_DIGITAL", "2"],
    "EKDV": ["FANZA_DIGITAL", ""],
    "FNS": ["FANZA_DIGITAL", "1"],
    "FSDSS": ["FANZA_DIGITAL", "1"],
    "FSET": ["FANZA_DIGITAL", "1"],
    "GN": ["FANZA_DIGITAL", "188"],
    "HAWA": ["FANZA_DIGITAL", "1"],
    "HN": ["FANZA_DIGITAL", "188"],
    "IENE": ["FANZA_DIGITAL", "1"],
    "IENF": ["FANZA_DIGITAL", "1"],
    "IESP": ["FANZA_DIGITAL", "1"],
    "JERA": ["FANZA_DIGITAL", "1"],
    "KMHRS": ["FANZA_DIGITAL", "1"],
    "MGOLD": ["FANZA_DIGITAL", "1"],
    "MIST": ["FANZA_DIGITAL", "1"],
    "MTABS": ["FANZA_DIGITAL", "1"],
    "MTALL": ["FANZA_DIGITAL", "1"],
    "NAMH": ["FANZA_DIGITAL", "1"],
    "NEO": ["FANZA_DIGITAL", "433"],
    "NEZ": ["FANZA_DIGITAL", "188"],
    "NHDTA": ["FANZA_DIGITAL", "1"],
    "NHDTB": ["FANZA_DIGITAL", "1"],
    "NHDTC": ["FANZA_DIGITAL", "1"],
    "NOSKN": ["FANZA_DIGITAL", "1"],
    "NSBB": ["FANZA_DIGITAL", "1"],
    "NTR": ["FANZA_DIGITAL", "1"],
    "OFSD": ["FANZA_DIGITAL", "1"],
    "OKB": ["FANZA_DIGITAL", "1"],
    "OKK": ["FANZA_DIGITAL", "1"],
    "OKS": ["FANZA_DIGITAL", "1"],
    "OKV": ["FANZA_DIGITAL", "1"],
    "OKX": ["FANZA_DIGITAL", "1"],
    "PIYO": ["FANZA_DIGITAL", "1"],
    "PRIAN": ["FANZA_DIGITAL", "5389"],
    "SGKI": ["FANZA_DIGITAL", "1"],
    "SUN": ["FANZA_DIGITAL", "1"],
    "SVDVD": ["FANZA_DIGITAL", "1"],
    "SVFLA": ["FANZA_DIGITAL", "1"],
    "SVSHA": ["FANZA_DIGITAL", "1"],
    "SW": ["FANZA_DIGITAL", "1"],
    "WAWA": ["FANZA_DIGITAL", "1"],
    "WFR": ["FANZA_DIGITAL", "2"],
    "WO": ["FANZA_DIGITAL", "1"],
    "3DSVR": ["FANZA_DIGITAL", "1"],
    "AEGE": ["FANZA_DIGITAL", "1"],
    "AKDL": ["FANZA_DIGITAL", "1"],

    // Serebu No Tomo    
    "CEAD": ["FANZA_DIGITAL", ""],
    "CEMD": ["FANZA_DIGITAL", ""],
    "34ID": ["FANZA_DIGITAL","55"],
    "AAA": ["FANZA_DIGITAL","143"],
    "ABBA": ["FANZA_DIGITAL","h_086"],
    "ACHJ": ["FANZA_DIGITAL",""],
    "ACZ": ["FANZA_DIGITAL","h_019"],
    "ADHN": ["FANZA_DIGITAL","h_1820"],
    "ADN": ["FANZA_DIGITAL",""],
    "ADVO": ["FANZA_DIGITAL",""],
    "AGAV": ["FANZA_DIGITAL",""],
    "AGEOM": ["FANZA_DIGITAL",""],
    "AGMX": ["FANZA_DIGITAL",""],
    "AILB": ["FANZA_DIGITAL",""],
    "AKDLD": ["FANZA_MONO","1"],
    "ALB": ["FANZA_DIGITAL",""],
    "ALDN": ["FANZA_DIGITAL",""],
    "ALOG": ["FANZA_DIGITAL","h_491"],
    "ANAV": ["FANZA_DIGITAL",""],
    "ANGR": ["FANZA_MONO","h_771"],
    "ANX": ["FANZA_DIGITAL",""],
    "AP": ["FANZA_DIGITAL",""],
    "APAA": ["FANZA_DIGITAL",""],
    "APAK": ["FANZA_DIGITAL",""],
    "APGH": ["FANZA_DIGITAL",""],
    "APKH": ["FANZA_DIGITAL",""],
    "APNS": ["FANZA_DIGITAL",""],
    "APRG": ["FANZA_DIGITAL",""],
    "AQSH": ["FANZA_DIGITAL",""],
    "ARAN": ["FANZA_DIGITAL",""],
    "ARATHD": ["FANZA_DIGITAL","p"],
    "ARM": ["FANZA_DIGITAL","11"],
    "ARMG": ["FANZA_DIGITAL",""],
    "ARMT": ["FANZA_DIGITAL",""],
    "ARSO": ["FANZA_DIGITAL","h_1378"],
    "ASIA": ["FANZA_DIGITAL",""],
    "ATFB": ["FANZA_DIGITAL",""],
    "ATID": ["FANZA_DIGITAL",""],
    "ATOM": ["FANZA_DIGITAL","1"],
    "ATYA": ["FANZA_DIGITAL",""],
    "AUKG": ["FANZA_DIGITAL",""],
    "AVOP": ["FANZA_DIGITAL","h_175"],
    "AVSA": ["FANZA_DIGITAL",""],
    "AWAW": ["FANZA_DIGITAL","h_1819"],
    "BAB": ["FANZA_DIGITAL",""],
    "BABD": ["FANZA_DIGITAL",""],
    "BACJ": ["FANZA_DIGITAL",""],
    "BAGR": ["FANZA_DIGITAL",""],
    "BAHP": ["FANZA_DIGITAL",""],
    "BASJ": ["FANZA_DIGITAL",""],
    "BAZX": ["FANZA_MONO","84"],
    "BBI": ["FANZA_DIGITAL",""],
    "BBSS": ["FANZA_DIGITAL",""],
    "BBTU": ["FANZA_DIGITAL",""],
    "BCV": ["FANZA_MONO","118"],
    "BDMDB": ["FANZA_MONO","84"],
    "BDSR": ["FANZA_DIGITAL","57"],
    "BDST": ["FANZA_DIGITAL","h_1787"],
    "BEB": ["FANZA_DIGITAL",""],
    "BF": ["FANZA_DIGITAL",""],
    "BGN": ["PRESTIGE",""],
    "BGNY": ["FANZA_DIGITAL",""],
    "BHG": ["FANZA_DIGITAL",""],
    "BHSP": ["FANZA_DIGITAL",""],
    "BID": ["FANZA_DIGITAL",""],
    "BIGC": ["FANZA_DIGITAL",""],
    "BIJN": ["FANZA_DIGITAL",""],
    "BIST": ["FANZA_DIGITAL",""],
    "BKD": ["FANZA_DIGITAL",""],
    "BKKG": ["FANZA_DIGITAL","h_1067"],
    "BLK": ["FANZA_DIGITAL",""],
    "BLOR": ["FANZA_DIGITAL",""],
    "BMW": ["FANZA_DIGITAL",""],
    "BNST": ["FANZA_DIGITAL",""],
    "BOBB": ["FANZA_DIGITAL",""],
    "BOIN": ["FANZA_MONO","436"],
    "BOMN": ["FANZA_DIGITAL",""],
    "BONU": ["FANZA_DIGITAL",""],
    "BONY": ["FANZA_DIGITAL",""],
    "BOOBS": ["FANZA_DIGITAL","1"],
    "BOU": ["FANZA_DIGITAL","h_113"],
    "BRV": ["FANZA_DIGITAL","h_1755"],
    "BTH": ["FANZA_DIGITAL","h_1435"],
    "BUR": ["FANZA_DIGITAL","12"],
    "BW": ["FANZA_DIGITAL","504i"],
    "C": ["FANZA_DIGITAL","140"],
    "CAT": ["FANZA_MONO","436"],
    "CAWB": ["FANZA_DIGITAL",""],
    "CAWD": ["FANZA_DIGITAL",""],
    "CEN": ["FANZA_MONO","2"],
    "CESD": ["FANZA_DIGITAL",""],
    "CETD": ["FANZA_DIGITAL",""],
    "CHAE": ["FANZA_DIGITAL","434"],
    "CHC": ["FANZA_DIGITAL","h_1751"],
    "CHERD": ["FANZA_DIGITAL","h_086"],
    "CHIB": ["FANZA_DIGITAL",""],
    "CHKP": ["FANZA_DIGITAL","h_687"],
    "CHRV": ["FANZA_DIGITAL",""],
    "CJOB": ["FANZA_DIGITAL",""],
    "CJOD": ["FANZA_DIGITAL",""],
    "CLDG": ["FANZA_DIGITAL",""],
    "CLUB": ["FANZA_DIGITAL",""],
    "CMF": ["FANZA_DIGITAL",""],
    "CMI": ["FANZA_DIGITAL","118"],
    "CND": ["FANZA_DIGITAL",""],
    "CNSTV": ["FANZA_DIGITAL","h_1472"],
    "COD": ["FANZA_DIGITAL","24"],
    "COGM": ["FANZA_DIGITAL",""],
    "COSX": ["FANZA_DIGITAL",""],
    "CPZ": ["FANZA_MONO","1"],
    "CRH": ["FANZA_DIGITAL","28"],
    "CRNX": ["FANZA_DIGITAL",""],
    "CRPD": ["FANZA_DIGITAL",""],
    "CSPL": ["FANZA_DIGITAL",""],
    "CWM": ["FANZA_DIGITAL","2"],
    "DAL": ["FANZA_DIGITAL","h_1711"],
    "DAMX": ["FANZA_DIGITAL","h_1647"],
    "DANDAN": ["FANZA_DIGITAL","1"],
    "DANDY": ["FANZA_DIGITAL","1"],
    "DANDYA": ["FANZA_DIGITAL","1"],
    "DASD": ["FANZA_DIGITAL",""],
    "DASS": ["FANZA_DIGITAL",""],
    "DAVK": ["FANZA_DIGITAL",""],
    "DAZD": ["FANZA_DIGITAL",""],
    "DBNK": ["FANZA_DIGITAL",""],
    "DDB": ["FANZA_DIGITAL",""],
    "DDFF": ["FANZA_DIGITAL",""],
    "DDH": ["FANZA_DIGITAL",""],
    "DDK": ["FANZA_DIGITAL",""],
    "DDOB": ["FANZA_DIGITAL",""],
    "DEAB": ["FANZA_DIGITAL",""],
    "DEAS": ["FANZA_DIGITAL",""],
    "DEBZ": ["FANZA_DIGITAL",""],
    "DEP": ["FANZA_DIGITAL","118"],
    "DETK": ["FANZA_DIGITAL",""],
    "DFE": ["FANZA_DIGITAL","2"],
    "DHLD": ["FANZA_MONO","h_139"],
    "DISM": ["FANZA_DIGITAL","1"],
    "DIV": ["FANZA_DIGITAL","h_275"],
    "DIVAS": ["FANZA_DIGITAL",""],
    "DJSK": ["FANZA_DIGITAL","29"],
    "DKDN": ["FANZA_MONO","h_139"],
    "DLV": ["FANZA_MONO","118"],
    "DMDG": ["FANZA_DIGITAL",""],
    "DMOW": ["FANZA_DIGITAL","36"],
    "DNJR": ["FANZA_DIGITAL",""],
    "DNPS": ["FANZA_DIGITAL","1"],
    "DNW": ["FANZA_MONO","118"],
    "DOCM": ["FANZA_DIGITAL","h_1711"],
    "DOCZ": ["FANZA_DIGITAL","h_1711"],
    "DOGG": ["FANZA_DIGITAL",""],
    "DOKB": ["FANZA_DIGITAL",""],
    "DOKI": ["FANZA_DIGITAL","h_1664"],
    "DOKS": ["FANZA_MONO","h_139"],
    "DOPU": ["FANZA_DIGITAL","1"],
    "DPHG": ["FANZA_DIGITAL","33"],
    "DPMI": ["FANZA_DIGITAL",""],
    "DROP": ["FANZA_MONO","h_139"],
    "DRPT": ["FANZA_DIGITAL","1"],
    "DSAM": ["FANZA_DIGITAL",""],
    "DSJH": ["FANZA_MONO","h_139"],
    "DSKM": ["FANZA_MONO","h_139"],
    "DSOD": ["FANZA_DIGITAL",""],
    "DSS": ["FANZA_DIGITAL",""],
    "DV": ["FANZA_MONO","41ho"],
    "DVAJ": ["FANZA_DIGITAL",""],
    "DVDES": ["FANZA_DIGITAL","1"],
    "DVDMS": ["FANZA_DIGITAL",""],
    "DVEH": ["FANZA_DIGITAL",""],
    "DVMM": ["FANZA_DIGITAL",""],
    "DVRT": ["FANZA_DIGITAL",""],
    "EBOD": ["FANZA_DIGITAL",""],
    "EBON": ["FANZA_DIGITAL","h_1711"],
    "EBWH": ["FANZA_DIGITAL",""],
    "EDD": ["FANZA_DIGITAL","118"],
    "EIKI": ["FANZA_DIGITAL","57"],
    "EKW": ["FANZA_DIGITAL","2"],
    "ENKI": ["FANZA_DIGITAL",""],
    "EQ": ["FANZA_MONO","h_100"],
    "EROFV": ["FANZA_DIGITAL","h_1472"],
    "EXVR": ["FANZA_MONO","436"],
    "EYAN": ["FANZA_DIGITAL",""],
    "FAB": ["FANZA_DIGITAL",""],
    "FAYS": ["FANZA_DIGITAL","55"],
    "FCDSS": ["FANZA_DIGITAL","1"],
    "FEM": ["FANZA_DIGITAL",""],
    "FERA": ["FANZA_DIGITAL","h_086"],
    "FEST": ["FANZA_DIGITAL","h_1721"],
    "FETJ": ["FANZA_MONO","36"],
    "FFT": ["FANZA_MONO","h_1712"],
    "FGAN": ["FANZA_DIGITAL","h_1440"],
    "FIG": ["FANZA_MONO","118"],
    "FIT": ["FANZA_MONO","118"],
    "FJIN": ["FANZA_DIGITAL",""],
    "FKOS": ["FANZA_DIGITAL","h_1721"],
    "FKOU": ["FANZA_DIGITAL",""],
    "FKRU": ["FANZA_DIGITAL",""],
    "FLAB": ["FANZA_DIGITAL","h_1721"],
    "FLAV": ["FANZA_DIGITAL",""],
    "FNEW": ["FANZA_DIGITAL","h_491"],
    "FOD": ["FANZA_DIGITAL","24"],
    "FOFI": ["FANZA_DIGITAL","h_491"],
    "FONE": ["FANZA_DIGITAL","h_491"],
    "FORE": ["FANZA_DIGITAL","h_1836"],
    "FPRE": ["FANZA_DIGITAL",""],
    "FSBK": ["FANZA_DIGITAL","h_491"],
    "FSEI": ["FANZA_DIGITAL","h_1721"],
    "FSFST": ["FANZA_DIGITAL","1"],
    "FSPT": ["FANZA_DIGITAL","h_491"],
    "FSTU": ["FANZA_DIGITAL",""],
    "FTAV": ["FANZA_DIGITAL","1"],
    "FTHT": ["FANZA_DIGITAL","1"],
    "FTHTD": ["FANZA_DIGITAL","1"],
    "FTK": ["FANZA_DIGITAL","1"],
    "FTKD": ["FANZA_DIGITAL","1"],
    "FTNL": ["FANZA_DIGITAL","h_1809"],
    "FUGA": ["FANZA_DIGITAL","h_086"],
    "FW": ["FANZA_DIGITAL","h_1089"],
    "FWTR": ["FANZA_DIGITAL",""],
    "GAGO": ["FANZA_DIGITAL","h_1632"],
    "GAOR": ["FANZA_DIGITAL",""],
    "GAR": ["FANZA_DIGITAL","1"],
    "GARA": ["FANZA_DIGITAL",""],
    "GAS": ["FANZA_DIGITAL","71"],
    "GASO": ["FANZA_DIGITAL","h_906"],
    "GBSA": ["FANZA_DIGITAL",""],
    "GBYKM": ["FANZA_DIGITAL","h_1780"],
    "GDHH": ["FANZA_DIGITAL",""],
    "GDJP": ["FANZA_DIGITAL",""],
    "GDPDX": ["FANZA_DIGITAL","h_1780"],
    "GDRD": ["FANZA_DIGITAL",""],
    "GDTM": ["FANZA_DIGITAL",""],
    "GEBB": ["FANZA_DIGITAL",""],
    "GENU": ["FANZA_DIGITAL",""],
    "GESY": ["FANZA_DIGITAL",""],
    "GETS": ["FANZA_DIGITAL","118"],
    "GFJ": ["FANZA_DIGITAL","h_1294"],
    "GGP": ["FANZA_DIGITAL","h_1472"],
    "GIGL": ["FANZA_DIGITAL",""],
    "GIRL": ["FANZA_DIGITAL","h_491"],
    "GKOK": ["FANZA_DIGITAL",""],
    "GMA": ["FANZA_DIGITAL",""],
    "GMDMS": ["FANZA_DIGITAL","h_1780"],
    "GMEM": ["FANZA_DIGITAL",""],
    "GNS": ["FANZA_DIGITAL","h_1596"],
    "GODR": ["FANZA_MONO","h_1059"],
    "GOHM": ["FANZA_DIGITAL",""],
    "GOJI": ["FANZA_DIGITAL","h_1729"],
    "GOJU": ["FANZA_DIGITAL","h_1165"],
    "GOOD": ["FANZA_DIGITAL","h_1133"],
    "GOUL": ["FANZA_DIGITAL","h_086"],
    "GQN": ["FANZA_DIGITAL",""],
    "GQW": ["FANZA_DIGITAL",""],
    "GRGR": ["FANZA_MONO","h_1071"],
    "GRMO": ["FANZA_DIGITAL","h_1534"],
    "GS": ["FANZA_DIGITAL","1"],
    "GST": ["FANZA_DIGITAL","13"],
    "GSUMK": ["FANZA_DIGITAL","h_1780"],
    "GTAL": ["FANZA_DIGITAL",""],
    "GTAXD": ["FANZA_DIGITAL","h_1780"],
    "GTJ": ["FANZA_DIGITAL",""],
    "GURHD": ["FANZA_DIGITAL","h_1780"],
    "HALE": ["FANZA_DIGITAL",""],
    "HALT": ["FANZA_DIGITAL",""],
    "HAVD": ["FANZA_DIGITAL","1"],
    "HAZU": ["FANZA_DIGITAL",""],
    "HBAD": ["FANZA_DIGITAL","1"],
    "HBK": ["FANZA_DIGITAL","h_848"],
    "HBLA": ["FANZA_DIGITAL",""],
    "HDKA": ["FANZA_DIGITAL","h_237"],
    "HDRT": ["FANZA_DIGITAL",""],
    "HED": ["FANZA_DIGITAL","28"],
    "HERK": ["FANZA_DIGITAL",""],
    "HERW": ["FANZA_DIGITAL",""],
    "HEZ": ["FANZA_DIGITAL","59"],
    "HGOT": ["FANZA_MONO","84"],
    "HHF": ["FANZA_DIGITAL",""],
    "HHKL": ["FANZA_DIGITAL",""],
    "HIA": ["FANZA_DIGITAL",""],
    "HIKB": ["FANZA_DIGITAL",""],
    "HIKR": ["FANZA_DIGITAL",""],
    "HITMA": ["FANZA_DIGITAL","55"],
    "HJBB": ["FANZA_DIGITAL",""],
    "HJMO": ["FANZA_DIGITAL",""],
    "HMDNV": ["FANZA_DIGITAL","h_1472"],
    "HMGL": ["FANZA_DIGITAL","h_172"],
    "HMN": ["FANZA_DIGITAL",""],
    "HNAMH": ["FANZA_DIGITAL","1"],
    "HNB": ["FANZA_DIGITAL","h_254"],
    "HNBR": ["FANZA_DIGITAL","h_1664"],
    "HND": ["FANZA_DIGITAL",""],
    "HNDS": ["FANZA_DIGITAL",""],
    "HNK": ["FANZA_MONO","59"],
    "HNTDS": ["FANZA_DIGITAL",""],
    "HNTV": ["FANZA_DIGITAL",""],
    "HODV": ["FANZA_MONO","41"],
    "HOIP": ["FANZA_DIGITAL",""],
    "HOIZ": ["FANZA_DIGITAL",""],
    "HOKS": ["FANZA_DIGITAL",""],
    "HOMA": ["FANZA_DIGITAL",""],
    "HONB": ["FANZA_DIGITAL","h_1133"],
    "HOWS": ["FANZA_DIGITAL",""],
    "HPET": ["FANZA_DIGITAL",""],
    "HR": ["FANZA_DIGITAL","h_113"],
    "HRSM": ["FANZA_DIGITAL","h_1745"],
    "HRU": ["FANZA_DIGITAL","59"],
    "HSOD": ["FANZA_DIGITAL",""],
    "HSODA": ["FANZA_DIGITAL",""],
    "HTHD": ["FANZA_DIGITAL","h_086"],
    "HTMA": ["FANZA_MONO","n_650"],
    "HTTM": ["FANZA_DIGITAL","h_068"],
    "HUBLK": ["FANZA_DIGITAL",""],
    "HUNT": ["FANZA_DIGITAL","1"],
    "HUNTA": ["FANZA_DIGITAL",""],
    "HUNTB": ["FANZA_DIGITAL",""],
    "HUNTC": ["FANZA_DIGITAL",""],
    "HUSR": ["FANZA_DIGITAL","57"],
    "HZGB": ["FANZA_DIGITAL","h_1100"],
    "HZGS": ["FANZA_DIGITAL","h_1100"],
    "IBMA": ["FANZA_DIGITAL","504"],
    "IBW": ["FANZA_DIGITAL","504"],
    "ID": ["FANZA_DIGITAL","h_113"],
    "IDVDES": ["FANZA_DIGITAL","a"],
    "IDVDPS": ["FANZA_DIGITAL","a"],
    "IFDVE": ["FANZA_DIGITAL","1"],
    "IGU": ["FANZA_DIGITAL","33"],
    "IKUNA": ["FANZA_DIGITAL","1"],
    "IMO": ["FANZA_DIGITAL","12"],
    "INCT": ["FANZA_MONO",""],
    "INDI": ["FANZA_MONO","h_917"],
    "INF": ["FANZA_DIGITAL","118"],
    "INMR": ["FANZA_DIGITAL","h_1836"],
    "INU": ["FANZA_DIGITAL","118"],
    "IPBZ": ["FANZA_DIGITAL",""],
    "IPIT": ["FANZA_DIGITAL",""],
    "IPOK": ["FANZA_DIGITAL",""],
    "IPSE": ["FANZA_DIGITAL",""],
    "IPTD": ["FANZA_DIGITAL",""],
    "IPX": ["FANZA_DIGITAL",""],
    "IQQQ": ["FANZA_DIGITAL","h_086"],
    "ISD": ["FANZA_DIGITAL",""],
    "ISJ": ["FANZA_DIGITAL","12"],
    "ISKF": ["FANZA_DIGITAL",""],
    "ITSR": ["FANZA_DIGITAL","57"],
    "JAC": ["FANZA_DIGITAL","118"],
    "JAG": ["FANZA_DIGITAL","28"],
    "JARB": ["FANZA_DIGITAL","h_1336"],
    "JCKL": ["FANZA_DIGITAL","h_1664"],
    "JFB": ["FANZA_DIGITAL",""],
    "JHEM": ["FANZA_DIGITAL",""],
    "JIMMY": ["FANZA_DIGITAL","1"],
    "JJBK": ["FANZA_DIGITAL",""],
    "JJCC": ["FANZA_DIGITAL",""],
    "JJDA": ["FANZA_DIGITAL",""],
    "JJDD": ["FANZA_DIGITAL",""],
    "JJEE": ["FANZA_DIGITAL",""],
    "JJGG": ["FANZA_DIGITAL","h_1758"],
    "JJPP": ["FANZA_DIGITAL",""],
    "JKSR": ["FANZA_DIGITAL","57"],
    "JKW": ["FANZA_DIGITAL","h_848"],
    "JMTY": ["FANZA_DIGITAL",""],
    "JNKD": ["FANZA_DIGITAL","h_1711"],
    "JNKE": ["FANZA_DIGITAL","h_1711"],
    "JOB": ["FANZA_DIGITAL","118"],
    "JOHS": ["FANZA_DIGITAL",""],
    "JRBA": ["FANZA_DIGITAL",""],
    "JUC": ["FANZA_DIGITAL",""],
    "JUFD": ["FANZA_DIGITAL",""],
    "JUFE": ["FANZA_DIGITAL",""],
    "JUL": ["FANZA_DIGITAL",""],
    "JUMS": ["FANZA_DIGITAL",""],
    "JUQ": ["FANZA_DIGITAL",""],
    "JUTA": ["FANZA_DIGITAL",""],
    "JUX": ["FANZA_DIGITAL",""],
    "JUY": ["FANZA_DIGITAL",""],
    "JYMA": ["FANZA_DIGITAL",""],
    "KAGH": ["FANZA_MONO","h_970"],
    "KAGN": ["FANZA_DIGITAL",""],
    "KAGP": ["FANZA_DIGITAL",""],
    "KAM": ["FANZA_DIGITAL",""],
    "KATU": ["FANZA_DIGITAL",""],
    "KAWD": ["FANZA_DIGITAL",""],
    "KBI": ["FANZA_MONO","118"],
    "KBTK": ["FANZA_DIGITAL",""],
    "KDMN": ["FANZA_DIGITAL","h_491"],
    "KEED": ["FANZA_DIGITAL","h_086"],
    "KHIP": ["FANZA_DIGITAL",""],
    "KIBD": ["FANZA_DIGITAL",""],
    "KIL": ["FANZA_DIGITAL","118"],
    "KIMR": ["FANZA_DIGITAL",""],
    "KINM": ["FANZA_DIGITAL","1"],
    "KIR": ["FANZA_DIGITAL","h_1664"],
    "KIRD": ["FANZA_DIGITAL",""],
    "KISD": ["FANZA_DIGITAL",""],
    "KMI": ["FANZA_DIGITAL",""],
    "KNIP": ["FANZA_DIGITAL",""],
    "KNMB": ["FANZA_DIGITAL","h_491"],
    "KOJA": ["FANZA_DIGITAL","1"],
    "KPIE": ["FANZA_DIGITAL",""],
    "KRAY": ["FANZA_DIGITAL",""],
    "KRI": ["FANZA_DIGITAL","h_286"],
    "KRND": ["FANZA_DIGITAL",""],
    "KSBJ": ["FANZA_DIGITAL",""],
    "KTB": ["FANZA_DIGITAL",""],
    "KTKZ": ["FANZA_DIGITAL",""],
    "KTRA": ["FANZA_DIGITAL","h_094"],
    "KUSE": ["FANZA_DIGITAL","1"],
    "KV": ["FANZA_MONO","h_955"],
    "KVDD": ["FANZA_DIGITAL","244"],
    "KWBD": ["FANZA_DIGITAL",""],
    "KYMI": ["FANZA_DIGITAL",""],
    "LAKA": ["FANZA_MONO","h_231"],
    "LANK": ["FANZA_DIGITAL","h_231"],
    "LAX": ["FANZA_DIGITAL","1"],
    "LID": ["FANZA_DIGITAL","24"],
    "LKB": ["FANZA_DIGITAL","1"],
    "LOCK": ["FANZA_DIGITAL","h_491"],
    "LOL": ["FANZA_DIGITAL","12"],
    "LOS": ["FANZA_DIGITAL","1"],
    "LUCY": ["FANZA_DIGITAL",""],
    "LUK": ["FANZA_DIGITAL","28"],
    "LULU": ["FANZA_DIGITAL",""],
    "LVSC": ["FANZA_DIGITAL","h_1770"],
    "LWQ": ["FANZA_DIGITAL","h_1294"],
    "MACB": ["FANZA_DIGITAL","h_687"],
    "MACH": ["FANZA_DIGITAL",""],
    "MADB": ["FANZA_DIGITAL",""],
    "MADM": ["FANZA_DIGITAL",""],
    "MADV": ["FANZA_DIGITAL",""],
    "MANX": ["FANZA_DIGITAL",""],
    "MAS": ["FANZA_DIGITAL","118"],
    "MASE": ["FANZA_DIGITAL",""],
    "MASM": ["FANZA_DIGITAL",""],
    "MBMA": ["FANZA_DIGITAL","h_460"],
    "MBRBS": ["FANZA_MONO","n_709"],
    "MBRK": ["FANZA_DIGITAL","h_1472"],
    "MBYD": ["FANZA_DIGITAL",""],
    "MCKT": ["FANZA_DIGITAL",""],
    "MCSR": ["FANZA_DIGITAL","57"],
    "MDB": ["FANZA_MONO","84"],
    "MDBK": ["FANZA_DIGITAL",""],
    "MDHR": ["FANZA_DIGITAL",""],
    "MDON": ["FANZA_DIGITAL",""],
    "MDS": ["FANZA_MONO","84"],
    "MDTM": ["FANZA_MONO","84"],
    "MDVHJ": ["FANZA_DIGITAL","48"],
    "MDVIJ": ["FANZA_DIGITAL","48"],
    "MDYD": ["FANZA_DIGITAL",""],
    "MEAD": ["FANZA_DIGITAL",""],
    "MEKO": ["FANZA_DIGITAL","h_1160"],
    "MESU": ["FANZA_DIGITAL","h_086"],
    "MEYD": ["FANZA_DIGITAL",""],
    "MFCD": ["FANZA_DIGITAL","h_1711"],
    "MFCL": ["FANZA_DIGITAL",""],
    "MFCO": ["FANZA_DIGITAL","h_1711"],
    "MFYD": ["FANZA_DIGITAL",""],
    "MGMJ": ["FANZA_DIGITAL",""],
    "MGMP": ["FANZA_DIGITAL",""],
    "MGMQ": ["FANZA_DIGITAL",""],
    "MGNL": ["FANZA_DIGITAL","1"],
    "MGT": ["FANZA_MONO","118"],
    "MGTD": ["FANZA_DIGITAL","h_1711"],
    "MIAA": ["FANZA_DIGITAL",""],
    "MIAB": ["FANZA_DIGITAL",""],
    "MIAD": ["FANZA_DIGITAL",""],
    "MIAE": ["FANZA_DIGITAL",""],
    "MIBB": ["FANZA_DIGITAL",""],
    "MIDA": ["FANZA_DIGITAL",""],
    "MIDD": ["FANZA_DIGITAL",""],
    "MIDE": ["FANZA_DIGITAL",""],
    "MIDV": ["FANZA_MONO",""],
    "MIFD": ["FANZA_DIGITAL",""],
    "MIGD": ["FANZA_DIGITAL",""],
    "MIHA": ["FANZA_DIGITAL","1"],
    "MIHD": ["FANZA_DIGITAL",""],
    "MIKR": ["FANZA_DIGITAL",""],
    "MIMA": ["FANZA_DIGITAL",""],
    "MIMK": ["FANZA_DIGITAL",""],
    "MIQD": ["FANZA_DIGITAL",""],
    "MIRD": ["FANZA_DIGITAL",""],
    "MISM": ["FANZA_DIGITAL",""],
    "MIVE": ["FANZA_DIGITAL",""],
    "MIZD": ["FANZA_DIGITAL",""],
    "MKCK": ["FANZA_DIGITAL",""],
    "MKMP": ["FANZA_DIGITAL",""],
    "MKON": ["FANZA_DIGITAL",""],
    "MKS": ["FANZA_DIGITAL","h_618"],
    "MLW": ["FANZA_MONO","h_606"],
    "MMGH": ["FANZA_DIGITAL",""],
    "MMKS": ["FANZA_DIGITAL",""],
    "MMKZ": ["FANZA_DIGITAL",""],
    "MMND": ["FANZA_DIGITAL",""],
    "MMPB": ["FANZA_DIGITAL",""],
    "MMPV": ["FANZA_DIGITAL",""],
    "MMTK": ["FANZA_DIGITAL",""],
    "MMUS": ["FANZA_DIGITAL",""],
    "MN": ["FANZA_MONO","h_213"],
    "MNGS": ["FANZA_DIGITAL",""],
    "MNIMZ": ["FANZA_DIGITAL","h_618"],
    "MOGI": ["FANZA_DIGITAL","1"],
    "MOGK": ["FANZA_DIGITAL",""],
    "MOMJ": ["FANZA_DIGITAL","18"],
    "MOND": ["FANZA_DIGITAL",""],
    "MOON": ["FANZA_DIGITAL","1"],
    "MOOR": ["FANZA_DIGITAL",""],
    "MOPE": ["FANZA_DIGITAL",""],
    "MOPP": ["FANZA_DIGITAL",""],
    "MOPT": ["FANZA_DIGITAL",""],
    "MOSJ": ["FANZA_MONO","n_650"],
    "MPTE": ["FANZA_DIGITAL",""],
    "MREC": ["FANZA_DIGITAL",""],
    "MRFK": ["FANZA_DIGITAL",""],
    "MRHP": ["FANZA_DIGITAL",""],
    "MRPA": ["FANZA_DIGITAL",""],
    "MRSS": ["FANZA_DIGITAL",""],
    "MRXD": ["FANZA_DIGITAL",""],
    "MSAJ": ["FANZA_DIGITAL",""],
    "MSTT": ["FANZA_DIGITAL",""],
    "MTYD": ["FANZA_DIGITAL",""],
    "MUCD": ["FANZA_DIGITAL",""],
    "MUDR": ["FANZA_DIGITAL",""],
    "MUFR": ["FANZA_DIGITAL",""],
    "MUGE": ["FANZA_DIGITAL",""],
    "MUKA": ["FANZA_DIGITAL",""],
    "MUKC": ["FANZA_DIGITAL",""],
    "MUKD": ["FANZA_DIGITAL",""],
    "MUM": ["FANZA_DIGITAL",""],
    "MVG": ["FANZA_DIGITAL",""],
    "MVSD": ["FANZA_DIGITAL",""],
    "MVSH": ["FANZA_DIGITAL",""],
    "MXGS": ["FANZA_DIGITAL","h_068"],
    "MYBA": ["FANZA_DIGITAL",""],
    "MYMD": ["FANZA_DIGITAL",""],
    "NACS": ["FANZA_DIGITAL","h_771"],
    "NACT": ["FANZA_DIGITAL","h_237"],
    "NACX": ["FANZA_DIGITAL","h_237"],
    "NAGST": ["FANZA_DIGITAL",""],
    "NAMHS": ["FANZA_DIGITAL","1"],
    "NANP": ["FANZA_MONO","84"],
    "NANX": ["FANZA_MONO","84"],
    "NATR": ["FANZA_DIGITAL","h_067"],
    "NCG": ["FANZA_DIGITAL","33"],
    "NCYF": ["FANZA_DIGITAL",""],
    "NDRA": ["FANZA_DIGITAL",""],
    "NECO": ["FANZA_DIGITAL","h_491"],
    "NFDM": ["FANZA_DIGITAL","h_188"],
    "NGHJ": ["FANZA_DIGITAL",""],
    "NGOD": ["FANZA_DIGITAL",""],
    "NHMS": ["FANZA_DIGITAL",""],
    "NIMA": ["FANZA_DIGITAL",""],
    "NINE": ["FANZA_DIGITAL","h_1133"],
    "NITR": ["FANZA_DIGITAL","49"],
    "NKD": ["FANZA_DIGITAL",""],
    "NKKD": ["FANZA_DIGITAL",""],
    "NLD": ["FANZA_DIGITAL","24"],
    "NMCH": ["FANZA_DIGITAL","h_491"],
    "NMK": ["FANZA_DIGITAL","h_897"],
    "NMSL": ["FANZA_DIGITAL","h_1814"],
    "NNIT": ["FANZA_DIGITAL",""],
    "NNOD": ["FANZA_DIGITAL",""],
    "NNPJ": ["FANZA_DIGITAL",""],
    "NOP": ["FANZA_DIGITAL","33"],
    "NPH": ["FANZA_DIGITAL","1"],
    "NPJB": ["FANZA_DIGITAL",""],
    "NPJH": ["FANZA_DIGITAL",""],
    "NPJS": ["FANZA_DIGITAL",""],
    "NPS": ["FANZA_DIGITAL","h_021"],
    "NRS": ["FANZA_DIGITAL","118"],
    "NSFS": ["FANZA_DIGITAL",""],
    "NSM": ["FANZA_DIGITAL","h_1342"],
    "NSODN": ["FANZA_DIGITAL",""],
    "NSPS": ["FANZA_DIGITAL","b"],
    "NTKD": ["FANZA_DIGITAL",""],
    "NTRD": ["FANZA_DIGITAL","18"],
    "NTRH": ["FANZA_DIGITAL",""],
    "NTSU": ["FANZA_DIGITAL",""],
    "NVH": ["FANZA_DIGITAL",""],
    "ODFP": ["FANZA_DIGITAL","h_537"],
    "ODVHJ": ["FANZA_DIGITAL","48"],
    "OFES": ["FANZA_DIGITAL",""],
    "OFJE": ["FANZA_DIGITAL",""],
    "OFKU": ["FANZA_DIGITAL","h_1664"],
    "OFTR": ["FANZA_DIGITAL","1"],
    "OKZU": ["FANZA_DIGITAL",""],
    "OLM": ["FANZA_DIGITAL","h_1757"],
    "OMEG": ["FANZA_DIGITAL","118"],
    "ONEZ": ["FANZA_DIGITAL","118"],
    "ONSG": ["FANZA_DIGITAL",""],
    "OTIN": ["FANZA_DIGITAL","h_1133"],
    "OVG": ["FANZA_DIGITAL","13"],
    "OYC": ["FANZA_DIGITAL",""],
    "PAKO": ["FANZA_DIGITAL","h_1133"],
    "PAOX": ["FANZA_DIGITAL","h_1646"],
    "PBD": ["FANZA_DIGITAL",""],
    "PED": ["FANZA_DIGITAL","24"],
    "PETS": ["FANZA_DIGITAL",""],
    "PFAS": ["FANZA_DIGITAL",""],
    "PFES": ["FANZA_DIGITAL",""],
    "PFT": ["FANZA_DIGITAL","1"],
    "PGD": ["FANZA_DIGITAL",""],
    "PKPD": ["FANZA_DIGITAL",""],
    "PKPL": ["FANZA_DIGITAL",""],
    "PKPR": ["FANZA_DIGITAL",""],
    "PKYS": ["FANZA_DIGITAL",""],
    "PLA": ["FANZA_DIGITAL",""],
    "PMGG": ["FANZA_DIGITAL","h_1758"],
    "PNCH": ["FANZA_MONO","h_803"],
    "PPBD": ["FANZA_DIGITAL",""],
    "PPPD": ["FANZA_DIGITAL",""],
    "PPPE": ["FANZA_DIGITAL",""],
    "PPR": ["FANZA_MONO","118"],
    "PPT": ["FANZA_DIGITAL","118"],
    "PRBYB": ["FANZA_MONO","n_1334"],
    "PRED": ["FANZA_DIGITAL",""],
    "PRIN": ["FANZA_DIGITAL",""],
    "PRPM": ["FANZA_DIGITAL",""],
    "PRST": ["FANZA_DIGITAL",""],
    "PRTD": ["FANZA_DIGITAL",""],
    "PRWF": ["FANZA_DIGITAL",""],
    "PS": ["FANZA_DIGITAL","h_113"],
    "PSST": ["FANZA_DIGITAL","h_1450"],
    "PTS": ["FANZA_DIGITAL","h_021"],
    "PXVR": ["FANZA_DIGITAL",""],
    "PYU": ["FANZA_DIGITAL","h_1462"],
    "PZD": ["FANZA_DIGITAL","24"],
    "QBD": ["FANZA_DIGITAL","24"],
    "QEEA": ["FANZA_MONO","30"],
    "RBD": ["FANZA_DIGITAL",""],
    "RBK": ["FANZA_DIGITAL",""],
    "RCT": ["FANZA_DIGITAL","1"],
    "RCTD": ["FANZA_DIGITAL","1"],
    "RD": ["FANZA_DIGITAL","149"],
    "RDT": ["FANZA_DIGITAL","118"],
    "REAL": ["FANZA_DIGITAL",""],
    "REXD": ["FANZA_DIGITAL",""],
    "REZD": ["FANZA_DIGITAL",""],
    "RGAV": ["FANZA_DIGITAL",""],
    "RGD": ["FANZA_DIGITAL","46"],
    "RIKURI": ["FANZA_DIGITAL","1mu"],
    "RKI": ["FANZA_DIGITAL",""],
    "RLMP": ["FANZA_DIGITAL",""],
    "RMSQ": ["FANZA_DIGITAL","h_1133"],
    "ROE": ["FANZA_DIGITAL",""],
    "ROOM": ["FANZA_DIGITAL",""],
    "ROYD": ["FANZA_DIGITAL",""],
    "RPIN": ["FANZA_DIGITAL",""],
    "RROY": ["FANZA_DIGITAL",""],
    "RTP": ["FANZA_DIGITAL","118"],
    "SABA": ["FANZA_DIGITAL","h_244"],
    "SACE": ["FANZA_DIGITAL","1"],
    "SAKO": ["FANZA_DIGITAL","h_261"],
    "SAME": ["FANZA_DIGITAL",""],
    "SAN": ["FANZA_DIGITAL","h_796"],
    "SAVR": ["FANZA_DIGITAL",""],
    "SCDC": ["FANZA_DIGITAL",""],
    "SCMF": ["FANZA_DIGITAL",""],
    "SCOP": ["FANZA_DIGITAL",""],
    "SCPX": ["FANZA_DIGITAL","h_565"],
    "SCR": ["FANZA_DIGITAL","12"],
    "SDAB": ["FANZA_DIGITAL","1"],
    "SDAM": ["FANZA_DIGITAL","1"],
    "SDDE": ["FANZA_DIGITAL","1"],
    "SDDS": ["FANZA_DIGITAL","1"],
    "SDGY": ["FANZA_DIGITAL",""],
    "SDJS": ["FANZA_DIGITAL","1"],
    "SDMM": ["FANZA_DIGITAL","1"],
    "SDMS": ["FANZA_DIGITAL","1"],
    "SDMT": ["FANZA_DIGITAL","1"],
    "SDMU": ["FANZA_DIGITAL","1"],
    "SDMUA": ["FANZA_DIGITAL","1"],
    "SDNM": ["FANZA_DIGITAL","1"],
    "SDSI": ["FANZA_DIGITAL","1"],
    "SE": ["FANZA_DIGITAL","h_113"],
    "SENN": ["FANZA_DIGITAL","1"],
    "SERO": ["FANZA_DIGITAL","h_422"],
    "SEV": ["FANZA_DIGITAL","h_660"],
    "SGKX": ["FANZA_MONO","h_1571"],
    "SGSR": ["FANZA_DIGITAL","57"],
    "SHE": ["FANZA_MONO","59"],
    "SHIND": ["FANZA_DIGITAL","h_1560"],
    "SHKD": ["FANZA_DIGITAL",""],
    "SIGL": ["FANZA_DIGITAL",""],
    "SILK": ["FANZA_DIGITAL","1"],
    "SIMW": ["FANZA_DIGITAL",""],
    "SINN": ["FANZA_DIGITAL",""],
    "SIR": ["FANZA_DIGITAL",""],
    "SIS": ["FANZA_DIGITAL","12"],
    "SKMN": ["FANZA_DIGITAL",""],
    "SKTH": ["FANZA_DIGITAL","1"],
    "SLAP": ["FANZA_DIGITAL",""],
    "SMCD": ["FANZA_DIGITAL",""],
    "SMJB": ["FANZA_DIGITAL",""],
    "SMKCX": ["FANZA_DIGITAL","h_1719"],
    "SMKD": ["FANZA_DIGITAL",""],
    "SMOK": ["FANZA_DIGITAL",""],
    "SMRA": ["FANZA_DIGITAL","2"],
    "SNIS": ["FANZA_DIGITAL",""],
    "SO": ["FANZA_MONO","1ar"],
    "SOAN": ["FANZA_DIGITAL",""],
    "SOAV": ["FANZA_DIGITAL",""],
    "SODAH": ["FANZA_DIGITAL",""],
    "SODS": ["FANZA_DIGITAL","1"],
    "SOE": ["FANZA_DIGITAL",""],
    "SON": ["FANZA_MONO","49"],
    "SORA": ["FANZA_DIGITAL",""],
    "SPE": ["FANZA_DIGITAL","h_113"],
    "SPJUR": ["FANZA_DIGITAL",""],
    "SPONE": ["FANZA_DIGITAL",""],
    "SPRD": ["FANZA_DIGITAL","18"],
    "SPRO": ["FANZA_DIGITAL","h_1594"],
    "SPZ": ["FANZA_MONO","h_1664"],
    "SQDE": ["FANZA_DIGITAL",""],
    "SQIS": ["FANZA_DIGITAL",""],
    "SQTE": ["FANZA_DIGITAL",""],
    "SRMC": ["FANZA_DIGITAL",""],
    "SSIS": ["FANZA_DIGITAL",""],
    "SSNI": ["FANZA_DIGITAL",""],
    "SSPD": ["FANZA_DIGITAL",""],
    "SSR": ["FANZA_MONO","h_746"],
    "STAR": ["FANZA_DIGITAL","1"],
    "STARBD": ["FANZA_MONO","1"],
    "STARS": ["FANZA_DIGITAL","1"],
    "START": ["FANZA_DIGITAL","1"],
    "STCVS": ["FANZA_DIGITAL","1"],
    "STOL": ["FANZA_DIGITAL",""],
    "SUJI": ["FANZA_DIGITAL",""],
    "SUMU": ["FANZA_DIGITAL","h_1753"],
    "SUPA": ["FANZA_DIGITAL",""],
    "SVBGR": ["FANZA_DIGITAL","1"],
    "SVCAO": ["FANZA_DIGITAL","1"],
    "SVGAL": ["FANZA_DIGITAL","1"],
    "SVMGM": ["FANZA_DIGITAL","1"],
    "SVVRT": ["FANZA_DIGITAL","1"],
    "SXMA": ["FANZA_DIGITAL","h_1133"],
    "SY": ["FANZA_DIGITAL","h_113"],
    "SYKH": ["FANZA_DIGITAL",""],
    "T": ["FANZA_MONO","55"],
    "T28": ["FANZA_MONO","55"],
    "T38": ["FANZA_DIGITAL","55"],
    "TAAK": ["FANZA_DIGITAL",""],
    "TAMZ": ["FANZA_DIGITAL","h_771"],
    "TANF": ["FANZA_DIGITAL",""],
    "TANP": ["FANZA_DIGITAL",""],
    "TAP": ["FANZA_DIGITAL","118"],
    "TBL": ["FANZA_DIGITAL","118"],
    "TBTB": ["FANZA_MONO","49"],
    "TCD": ["FANZA_DIGITAL",""],
    "TCHB": ["FANZA_DIGITAL",""],
    "TCHR": ["FANZA_DIGITAL",""],
    "TCUG": ["FANZA_DIGITAL",""],
    "TEAM": ["FANZA_DIGITAL",""],
    "TEK": ["FANZA_DIGITAL",""],
    "TEM": ["FANZA_DIGITAL","118"],
    "TEND": ["FANZA_DIGITAL","h_1753"],
    "TERA": ["FANZA_DIGITAL","18"],
    "THTP": ["FANZA_DIGITAL","h_1237"],
    "TICS": ["FANZA_DIGITAL",""],
    "TIKB": ["FANZA_DIGITAL",""],
    "TIKC": ["FANZA_DIGITAL",""],
    "TIMD": ["FANZA_DIGITAL","h_019"],
    "TIN": ["FANZA_MONO","h_728"],
    "TKOU": ["FANZA_DIGITAL","h_491"],
    "TLDC": ["FANZA_DIGITAL","1"],
    "TMBT": ["FANZA_DIGITAL",""],
    "TMVI": ["FANZA_DIGITAL","h_452"],
    "TMY": ["FANZA_DIGITAL","h_580"],
    "TNOZ": ["FANZA_DIGITAL",""],
    "TORG": ["FANZA_DIGITAL","h_771"],
    "TOTK": ["FANZA_DIGITAL","h_1133"],
    "TOTTE": ["FANZA_DIGITAL","1"],
    "TPPN": ["FANZA_DIGITAL",""],
    "TPRO": ["FANZA_DIGITAL","55"],
    "TS": ["FANZA_DIGITAL","118ge"],
    "TSK": ["FANZA_DIGITAL","h_1605s"],
    "TYAN": ["FANZA_DIGITAL",""],
    "TYD": ["FANZA_DIGITAL","24"],
    "TYOD": ["FANZA_DIGITAL",""],
    "UBUG": ["FANZA_DIGITAL","h_1133"],
    "UFD": ["FANZA_DIGITAL","24"],
    "UGH": ["FANZA_DIGITAL","h_1795"],
    "UGSS": ["FANZA_DIGITAL","18"],
    "ULT": ["FANZA_DIGITAL","118"],
    "UMAD": ["FANZA_DIGITAL","84"],
    "UMAN": ["FANZA_DIGITAL",""],
    "UMD": ["FANZA_DIGITAL","125"],
    "UMSO": ["FANZA_DIGITAL","84"],
    "UNDG": ["FANZA_DIGITAL","1"],
    "UPSM": ["FANZA_DIGITAL","h_150"],
    "URE": ["FANZA_DIGITAL",""],
    "URKK": ["FANZA_DIGITAL",""],
    "URKN": ["FANZA_DIGITAL","1"],
    "URMT": ["FANZA_DIGITAL",""],
    "USAG": ["FANZA_DIGITAL",""],
    "USBA": ["FANZA_DIGITAL",""],
    "UZU": ["FANZA_DIGITAL",""],
    "VAGU": ["FANZA_DIGITAL",""],
    "VAL": ["FANZA_DIGITAL","12"],
    "VDD": ["FANZA_DIGITAL","24"],
    "VEC": ["FANZA_DIGITAL",""],
    "VEMA": ["FANZA_DIGITAL",""],
    "VENU": ["FANZA_DIGITAL",""],
    "VENX": ["FANZA_DIGITAL",""],
    "VENZ": ["FANZA_DIGITAL",""],
    "VEO": ["FANZA_DIGITAL",""],
    "VEQ": ["FANZA_DIGITAL",""],
    "VGD": ["FANZA_MONO","512"],
    "VICD": ["FANZA_DIGITAL",""],
    "VNDS": ["FANZA_MONO","h_1664"],
    "VOD": ["FANZA_DIGITAL",""],
    "VOTAN": ["FANZA_DIGITAL","1"],
    "VOV": ["FANZA_DIGITAL","h_1350"],
    "VRKM": ["FANZA_DIGITAL",""],
    "VRNC": ["FANZA_DIGITAL","1"],
    "VRTM": ["FANZA_DIGITAL","h_910"],
    "VSPDS": ["FANZA_MONO","42"],
    "WA": ["FANZA_DIGITAL","h_047"],
    "WAAA": ["FANZA_DIGITAL",""],
    "WANZ": ["FANZA_DIGITAL",""],
    "WAT": ["FANZA_DIGITAL","118"],
    "WDI": ["FANZA_DIGITAL","2"],
    "WIF": ["FANZA_DIGITAL","h_308"],
    "WIL": ["FANZA_DIGITAL","118"],
    "WKD": ["FANZA_DIGITAL","2"],
    "WKED": ["FANZA_DIGITAL",""],
    "WNZ": ["FANZA_DIGITAL","3"],
    "WSS": ["FANZA_DIGITAL","2"],
    "WTEX": ["FANZA_DIGITAL",""],
    "WZEN": ["FANZA_DIGITAL","2"],
    "XOX": ["FANZA_DIGITAL","h_1472"],
    "XRW": ["FANZA_MONO","84"],
    "XV": ["FANZA_MONO","60"],
    "XVSR": ["FANZA_DIGITAL",""],
    "XVT": ["FANZA_DIGITAL",""],
    "YAKO": ["FANZA_DIGITAL","h_1133"],
    "YARIA": ["FANZA_DIGITAL","1"],
    "YDNS": ["FANZA_DIGITAL",""],
    "YFF": ["FANZA_DIGITAL","2"],
    "YJNS": ["FANZA_DIGITAL",""],
    "YMBP": ["FANZA_DIGITAL",""],
    "YMDD": ["FANZA_DIGITAL",""],
    "YMDS": ["FANZA_DIGITAL",""],
    "YMRK": ["FANZA_DIGITAL",""],
    "YOB": ["FANZA_DIGITAL","h_113"],
    "YOCH": ["FANZA_DIGITAL","h_086"],
    "YPAA": ["FANZA_DIGITAL","h_086"],
    "YRH": ["FANZA_DIGITAL","118"],
    "YRMN": ["FANZA_DIGITAL",""],
    "YRZ": ["FANZA_DIGITAL","118"],
    "YSN": ["FANZA_DIGITAL","h_127"],
    "YST": ["FANZA_DIGITAL","540"],
    "YTR": ["FANZA_DIGITAL","h_127"],
    "YUJ": ["FANZA_DIGITAL",""],
    "YUM": ["FANZA_DIGITAL","118"],
    "ZER": ["FANZA_DIGITAL","118"],
    "ZEX": ["FANZA_DIGITAL","h_720"],
    "ZIZG": ["FANZA_DIGITAL","h_826"],
    "ZOS": ["FANZA_DIGITAL","33"],
    "ZSGD": ["FANZA_DIGITAL","483"],
    "ZSMX": ["FANZA_MONO","n_650"],
    "ZUKO": ["FANZA_DIGITAL",""],
};



/**
 [ Prestige / 프레스티지 계열 ]
AMA, BGN, INU, JBS, JNT, KRV, MAS, MGT, PHX, PPP, PPT, PPX, PRD, RVRSS, SAD, SEI, SNG, THU, VPC, WAT, YRH, YRK, YRZ 

[ MOODYZ / 무디즈 계열 ]
LOVD, MDED, MDID, MDJD, MDLD, MDPD, MDQD, MDRD, MDUD, MDVR, MDWD, MDXD, MDYD, MEYD, MIAA, MIAB, MIAD, MIAE, MIAS, MIBD, MIDD, MIDE, MIDV, MIFD, MIGD, MIID, MIKR, MIMK, MINT, MIQD, MIRD, MIVD, MIXS, MIZD, MNGS 

[ SOD Create 계열 ]
DSVR, KIRE, MASD, MMGH, MOGI, SCDA, SCDE, SDDL, SDDM, SDHS, SDMS, SDMT, SDMU, SDNM, SDSI, SHYN, STAR, STKO, TIGR 

[ Attackers / 어택커즈 계열 ]
ADN, APNS, ATAD, ATID, ATKD, ATVR, JBD, RBD, RBK, SAME, SHKD, SSPD, YUJ 

[ Faleno / 팔레노 계열 ]
FADSS, FCDSS, FLNO, FLNS, FSVSS
 */


function fetchImageResolution(url) {

    const cleanUrl = url.split('?')[0];
    const finalUrl = cleanUrl.toLowerCase();


    // 1. URL 확장자를 통해 필요한 바이트 크기 미리 계산
    const getExpectedRange = (finalUrl) => {
        if (finalUrl.endsWith('.png') || finalUrl.endsWith('.gif')) {
            return "0-1000"; // PNG/GIF는 1KB면 충분함
        } else if (finalUrl.endsWith('.jpg') || finalUrl.endsWith('.jpeg')) {
            return "0-20000"; // JPEG나 알 수 없는 경우 20KB
        } else if (finalUrl.endsWith('.webp')) {
            return "0-5000"; // WebP는 약 5KB 정도
        }
    };

    const targetRange = getExpectedRange(finalUrl);

    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: finalUrl,
            headers: {
                "Range": `bytes=${targetRange}`,
                "Referer": finalUrl,
                "Origin": new URL(finalUrl).origin
            },
            responseType: "arraybuffer",            
            onload: (res) => {
                const status = res.status;
                let result = { width: 0, height: 0, status: res.status, errorReason: "", type: "Unknown" };

                // 1. HTTP 오류 체크
                if (status === 0) {
                    const sameDomain = location.hostname === new URL(finalUrl).hostname;
                    if (sameDomain) {
                        console.warn(`[VideoCode] status=0 (같은 도메인) → 네트워크 문제, 재시도 가능: ${finalUrl}`);
                        resolve({ exists: false, retry: true, reason: 'network_error' });
                    } else {
                        console.warn(`[VideoCode] status=0 (외부 도메인) → CORS 가능성, 재시도 허용: ${finalUrl}`);
                        resolve({ exists: false, retry: true, reason: 'cors_possible' });
                    }
                }
                else if (status >= 200 && status < 300) {
                    console.log(`[VideoCode] 이미지 존재 확인됨 (HTTP ${status}): ${finalUrl}`);
                    const bytes = new Uint8Array(res.response);

                    // 2. 포맷 판별 및 해상도 추출
                    // PNG (89 50 4E 47 ...)
                    if (bytes[0] === 0x89 && bytes[1] === 0x50) {
                        result.type = "PNG";
                        result.width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
                        result.height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
                    }
                    // GIF (47 49 46 38 ...)
                    else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
                        result.type = "GIF";
                        result.width = bytes[6] | (bytes[7] << 8); // Little-endian
                        result.height = bytes[8] | (bytes[9] << 8);
                    }
                    // JPEG (FF D8 ...)
                    else if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
                        result.type = "JPEG";
                        let i = 2;
                        while (i < bytes.length - 8) {
                            const marker = (bytes[i] << 8) | bytes[i + 1];
                            const len = (bytes[i + 2] << 8) | bytes[i + 3];
                            // SOF 마커 확인 (0xFFC0 ~ 0xFFCF 중 일부 제외)
                            if (marker >= 0xFFC0 && marker <= 0xFFCF && ![0xFFC4, 0xFFC8, 0xFFCC].includes(marker)) {
                                result.height = (bytes[i + 5] << 8) | bytes[i + 6];
                                result.width = (bytes[i + 7] << 8) | bytes[i + 8];
                                break;
                            }
                            i += len + 2;
                        }
                    }
                    // WebP (52 49 46 46 ... 57 45 42 50)
                    else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
                        result.type = "WebP";
                        // WebP는 내부 청크(VP8/VP8L/VP8X)에 따라 위치가 달라 더 복잡하지만,
                        // 간단하게 24-30바이트 사이에서 기초 해상도를 읽을 수 있습니다.
                        if (bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x38) {
                            result.width = (bytes[26] | (bytes[27] << 8)) & 0x3FFF;
                            result.height = (bytes[28] | (bytes[29] << 8)) & 0x3FFF;
                        }
                    }

                    if (!result.width) result.errorReason = "해상도 정보 추출 불가";
                    resolve({ exists: true, result });
                }
                else if (status >= 300 && status < 400) {
                    console.warn(`[VideoCode] 리다이렉트 응답 (HTTP ${status}): ${finalUrl}`);
                    // GM_xmlhttpRequest는 리다이렉트를 따라가므로 이 경우는 거의 없음
                    resolve({ exists: false, reason: 'redirect' });
                }
                else if (status === 403) {
                    console.warn(`[VideoCode] 국가제한 (HTTP ${status}): ${finalUrl}`);
                    resolve({ exists: false, reason: 'Region restrictions' });
                }
                else if (status >= 400 && status < 500) {
                    console.warn(`[VideoCode] 클라이언트 오류 (HTTP ${status}) → 이미지 없음: ${finalUrl}`);
                    resolve({ exists: false, reason: 'client_error' });
                }
                else if (status >= 500) {
                    console.warn(`[VideoCode] 서버 오류 (HTTP ${status}) → 재시도 가능: ${finalUrl}`);
                    resolve({ exists: false, reason: 'server_error' });
                }
            },
            onerror: () => resolve({ width: 0, height: 0, status: 0, errorReason: "네트워크 오류" }),
            ontimeout: () => resolve({ width: 0, height: 0, status: 0, errorReason: "시간 초과" })
        });
    });
}

function checkImageExistence(link) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: 'HEAD',
            url: link,            
            onload: function (response) {
                const status = response.status;
                if (status === 200) {
                    resolve({ exists: true, reason: 'OK', link, status });
                }
                else if (status === 403) {
                    console.warn(`[ImageRetry] 국가제한 (HTTP ${status}): ${link}`);
                    resolve({ exists: false, reason: 'Region restrictions', link, status });
                }
                else {
                    resolve({ exists: false, reason: 'error', link, status });
                }
            },
            onerror: () => resolve({ exists: false, reason: 'error', link }),
            ontimeout: () => resolve({ exists: false, reason: 'timeout', link })
        });
    });
}

function getMergedRules() {
    const merged = { ...DB_PREFIX_RULES };

    // 저장된 모든 키 목록을 가져와 "RULE_"로 시작하는 것만 필터링
    const allKeys = GM_listValues();
    allKeys.forEach(key => {
        if (key.startsWith('RULE_')) {
            const prefix = key.replace('RULE_', '');
            
        if (DB_PREFIX_RULES[key]) {
            GM_deleteValue(key);
        } else {
            merged[prefix] = GM_getValue(key);
        }
    }
    });

    return merged;
}

async function generateUrlCandidates(code, imageSrc = '') {
    const codePattern = /(\d{0,2}[a-zA-Z]{1,6}\d{0,2})-?(\d{3})([a-z]*)/i;
    const match = code.match(codePattern);
    if (!match) return [];

    const prefix = match[1].toUpperCase();
    const pureNum = match[2];
    const extraSuffix = (match[3] || "").toLowerCase();

    const candidates = [];
    const metaData = {};
    const CURRENT_RULES = getMergedRules();
    const numInt = parseInt(pureNum, 10);

    // --- 1. Prestige Old (예외 케이스) ---
    const isPrestigeOld = (
        (prefix === "BGN" && numInt >= 45 && numInt <= 72) ||
        (prefix === "CHN" && numInt >= 156 && numInt <= 217) ||
        (prefix === "ABP" && numInt >= 398 && numInt <= 999) ||
        (prefix === "ABW" && numInt >= 1 && numInt <= 279)
    );

    if (isPrestigeOld) {
        const url = `${BASE_URLS['PRESTIGE']}/${prefix.toLowerCase()}/${pureNum}/pb_${prefix.toLowerCase()}-${pureNum}.jpg`;
        candidates.push(url);
        metaData[url] = ["PRESTIGE", ""];
    }

    // --- 2. 이미 알고 있는 규칙 적용 ---
    if (CURRENT_RULES[prefix]) {
        const [category, extraPrefix] = CURRENT_RULES[prefix];
        const targetBaseUrl = BASE_URLS[category] || BASE_URLS["FANZA_DIGITAL"];

        // DIGITAL이면 5자리, 아니면 raw
        const formattedNum = (category === "FANZA_DIGITAL")
            ? pureNum.padStart(5, '0')
            : pureNum;

        const fileName = `${extraPrefix}${prefix.toLowerCase()}${formattedNum}${extraSuffix}`;
        const url = `${targetBaseUrl}/${fileName}/${fileName}pl.jpg`;

        candidates.push(url);
        metaData[url] = [category, extraPrefix];
    }

    // --- 3. DMM 이미지 경로 기반 후보 생성 ---
    if (imageSrc && imageSrc.includes('dmm')) {

        const pathSegments = imageSrc.split('/');
        const contentId = pathSegments[pathSegments.length - 2];
        const flexRegex = new RegExp(`(.*)${prefix}(\\d+)`, 'i');
        const fileMatch = contentId.match(flexRegex);

        if (fileMatch) {
            const extraPrefix = fileMatch[1];
            const rawNumStr = fileMatch[2];
            const zero5 = pureNum.padStart(5, '0');            

            // 1. DIGITAL 시도 (5자리)
            const digitalFName = `${extraPrefix}${prefix.toLowerCase()}${zero5}${extraSuffix}`;
            const digitalUrl = `${BASE_URLS["FANZA_DIGITAL"]}/${digitalFName}/${digitalFName}pl.jpg`;
            if (!metaData[digitalUrl]) {
                candidates.push(digitalUrl);
                metaData[digitalUrl] = ["FANZA_DIGITAL", extraPrefix];
            }

            // 2. MONO 시도
            const monoFName = `${extraPrefix}${prefix.toLowerCase()}${rawNumStr}${extraSuffix}`;
            const monoUrl = `${BASE_URLS["FANZA_MONO"]}/${monoFName}/${monoFName}pl.jpg`;
            if (!metaData[monoUrl]) {
                candidates.push(monoUrl);
                metaData[monoUrl] = ["FANZA_MONO", extraPrefix];
            }

        }
    }

    const uniqueCandidates = [...new Set(candidates)];
    uniqueCandidates._meta = metaData;
    uniqueCandidates._prefix = prefix;
    return uniqueCandidates;
}

function saveRuleFromUrl(url, prefix) {
    try {
        const urlObj = new URL(url);
        const host = urlObj.hostname; // 도메인 추출 (예: awsimgsrc.dmm.co.jp)
        const fileName = urlObj.pathname
            .split('/')
            .pop()
            .replace(/\..*$/, '')
            .replace(/p[ls]$/, '');

        const prefixIndex = fileName.toLowerCase().indexOf(prefix.toLowerCase());
        if (prefixIndex === -1) return;
        const extraPrefix = fileName.substring(0, prefixIndex);

        // URL 포함 키워드로 카테고리만 결정
        let category = "FANZA_DIGITAL";
        if (host === 'awsimgsrc.dmm.com') category = "FANZA_MONO";
        else if (host === 'pics.dmm.co.jp') category = "DMM_MONO";
        else if (host === 'prestige-av.com') category = "PRESTIGE";

        // 설정값 저장 [카테고리, 접두어]
        // 'RULE_' 접두사를 붙여서 저장
        GM_setValue('RULE_' + prefix, [category, extraPrefix]);        

        console.log(
            `%c[규칙 학습 완료] ${prefix} → ${category} (접두어: ${extraPrefix})`,
            "color: #00FF00; font-weight: bold;"
        );

    } catch (e) {
        console.error("규칙 저장 오류:", e);
    }
}