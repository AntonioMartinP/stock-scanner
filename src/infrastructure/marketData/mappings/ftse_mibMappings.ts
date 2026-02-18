// Borsa Italiana symbol mappings for each data provider.
// Yahoo Finance: .MI suffix  |  Stooq: .IT suffix

export const ftse_mib40ToStooqSymbol: Record<string, string> = {
  FTSEMIB:  "FTSEMIB.IT",
  ENI:      "ENI.IT",
  ENEL:     "ENEL.IT",
  ISP:      "ISP.IT",
  UCG:      "UCG.IT",
  STM:      "STM.IT",
  STLAM:    "STLAM.IT",
  RACE:     "RACE.IT",
  G:        "G.IT",
  MB:       "MB.IT",
  TIT:      "TIT.IT",
  A2A:      "A2A.IT"
};

export const ftse_mib40ToAlphaVantageSymbol: Record<string, string> = {
  ENI:      "ENI.MIL",
  ENEL:     "ENEL.MIL",
  ISP:      "ISP.MIL",
  UCG:      "UCG.MIL",
  STM:      "STM.MIL",
  STLAM:    "STLAM.MIL",
  RACE:     "RACE.MIL",
  G:        "G.MIL",
  MB:       "MB.MIL"
};

export const ftse_mib40ToYahooSymbol: Record<string, string> = {
  FTSEMIB:  "FTSEMIB.MI",
  ENI:      "ENI.MI",
  ENEL:     "ENEL.MI",
  ISP:      "ISP.MI",
  UCG:      "UCG.MI",
  STM:      "STM.MI",
  STLAM:    "STLAM.MI",
  RACE:     "RACE.MI",
  G:        "G.MI",
  MB:       "MB.MI",
  TIT:      "TIT.MI",
  A2A:      "A2A.MI",
  AMP:      "AMP.MI",
  ATL:      "ATL.MI",
  AZM:      "AZM.MI",
  BAMI:     "BAMI.MI",
  BMED:     "BMED.MI",
  BPE:      "BPE.MI",
  BUZZI:    "BZU.MI",
  CPR:      "CPR.MI",
  CNHI:     "CNHI.MI",
  DIA:      "DIA.MI",
  ERG:      "ERG.MI",
  FBK:      "FBK.MI",
  HER:      "HER.MI",
  IG:       "IG.MI",
  INW:      "INW.MI",
  LDO:      "LDO.MI",
  MONC:     "MONC.MI",
  NEXI:     "NEXI.MI",
  ORN:      "TRN.MI",
  PIRC:     "PIRC.MI",
  PRYSMIAN: "PRY.MI",
  REC:      "REC.MI",
  SPM:      "SPM.MI",
  SRG:      "SRG.MI",
  TLIT:     "TIM.MI",
  UNI:      "UNI.MI",
  WBC:      "WBC.MI"
};
