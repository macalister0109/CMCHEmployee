type STATELESS = "inProcess" | "inMiddle" | "finalized";
export interface offerDates {
    title: string;
    description: string;
    name: string;
    location: string;
    vacant: string;
    puntations: string;
    img: string;
    stateless: STATELESS;
}
