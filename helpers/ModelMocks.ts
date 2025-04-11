import { PropertyIdentity } from "../enums";
import { Profile } from "../types";


export const defaultProfile = (
  email: string,
  uid: string,
  username: string,
  firstName: string,
  lastName: string
): Profile => {
  return {
      propertyListings: {} as Record<PropertyIdentity,string>,
      propertyReviews: {} as Record<PropertyIdentity,string>,
      verified: false,
      currentIdentity: null,
      propertyIdentities: [] ,
      user: {
          authInfo: {
              uid,
              username,
              email,
              phone: "",
              secureLogin: true,
          },
          firstName,
          lastName,
          bio: "",
          gender: "",
          pronoun: "",
          nationality: "",
          ethnicity: "",
          dob:null,
          websites: {},
          socials: {},
          image: "",
          location: null,
          isAgreed: false,
      },
  }  as Profile;
};
