from __future__ import annotations

import ipaddress
from typing import Iterable

import pandas as pd


TARGET_COLUMN = "label"
DROP_COLUMNS = {"src", "dst"}


def _safe_ip_to_int(value: object) -> int:
    try:
        return int(ipaddress.ip_address(str(value)))
    except ValueError:
        return 0


def _safe_protocol(value: object) -> str:
    if value is None:
        return "UNKNOWN"
    text = str(value).strip().upper()
    return text or "UNKNOWN"


def prepare_dataframe(frame: pd.DataFrame) -> pd.DataFrame:
    df = frame.copy()
    df.columns = [column.strip() for column in df.columns]

    if "src" in df.columns:
        df["src_ip_int"] = df["src"].apply(_safe_ip_to_int)
        df["src_last_octet"] = df["src"].astype(str).str.split(".").str[-1].fillna("0")
        df["src_last_octet"] = pd.to_numeric(df["src_last_octet"], errors="coerce").fillna(0)

    if "dst" in df.columns:
        df["dst_ip_int"] = df["dst"].apply(_safe_ip_to_int)
        df["dst_last_octet"] = df["dst"].astype(str).str.split(".").str[-1].fillna("0")
        df["dst_last_octet"] = pd.to_numeric(df["dst_last_octet"], errors="coerce").fillna(0)

    if "src" in df.columns and "dst" in df.columns:
        src_prefix = df["src"].astype(str).str.rsplit(".", n=1).str[0]
        dst_prefix = df["dst"].astype(str).str.rsplit(".", n=1).str[0]
        df["same_subnet"] = (src_prefix == dst_prefix).astype(int)

    if "Protocol" in df.columns:
        df["Protocol"] = df["Protocol"].apply(_safe_protocol)

    for column in df.columns:
        if column == TARGET_COLUMN or column == "Protocol":
            continue
        df[column] = pd.to_numeric(df[column], errors="ignore")

    return df


def select_feature_columns(frame: pd.DataFrame) -> tuple[list[str], list[str], list[str]]:
    feature_columns = [
        column for column in frame.columns if column != TARGET_COLUMN and column not in DROP_COLUMNS
    ]
    categorical_features = [
        column for column in feature_columns if str(frame[column].dtype) in ("object", "category")
    ]
    numeric_features = [column for column in feature_columns if column not in categorical_features]
    return feature_columns, numeric_features, categorical_features


def build_input_frame(payloads: Iterable[dict], feature_columns: list[str]) -> pd.DataFrame:
    raw = pd.DataFrame(payloads)
    prepared = prepare_dataframe(raw)

    for column in feature_columns:
        if column not in prepared.columns:
            prepared[column] = 0 if column != "Protocol" else "UNKNOWN"

    return prepared[feature_columns]
