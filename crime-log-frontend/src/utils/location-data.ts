import {Country, State, City} from "country-state-city";

export type CityOption = { code: string; name: string };
export type StateOption = { code: string; name: string };
export type CountryOption = { code: string; name: string; nationality: string };

const countryCache: CountryOption[] = Country.getAllCountries().map((country) => ({
    code: country.isoCode,
    name: country.name,
    nationality: country.name
}));

export const getCountryOptions = (): CountryOption[] => countryCache;

export const getStateOptions = (countryCode: string): StateOption[] => {
    if (!countryCode) return [];
    return State.getStatesOfCountry(countryCode).map((state) => ({
        code: state.isoCode,
        name: state.name
    }));
};

export const getCityOptions = (countryCode: string, stateCode: string): CityOption[] => {
    if (!countryCode || !stateCode) return [];
    return City.getCitiesOfState(countryCode, stateCode).map((city) => ({
        code: `${stateCode}-${city.name}`,
        name: city.name
    }));
};
