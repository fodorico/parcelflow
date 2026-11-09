"""Countries ParcelFlow operates in. A shipment never leaves its country, and each country prices
everything in its own currency."""

from dataclasses import dataclass
from enum import StrEnum


class CountryCode(StrEnum):
    """ISO 3166-1 alpha-2 codes of the operating countries."""

    AR = "AR"
    US = "US"
    ES = "ES"


class CurrencyCode(StrEnum):
    """ISO 4217 codes."""

    ARS = "ARS"
    USD = "USD"
    EUR = "EUR"


class Language(StrEnum):
    """UI languages (BCP 47 tags)."""

    EN = "en"
    ES_419 = "es-419"


@dataclass(frozen=True)
class Country:
    code: CountryCode
    currency: CurrencyCode
    default_language: Language


COUNTRIES: dict[CountryCode, Country] = {
    CountryCode.AR: Country(CountryCode.AR, CurrencyCode.ARS, Language.ES_419),
    CountryCode.US: Country(CountryCode.US, CurrencyCode.USD, Language.EN),
    CountryCode.ES: Country(CountryCode.ES, CurrencyCode.EUR, Language.ES_419),
}
