import Banner from "../banner/Banner";
import PropTypes from "prop-types";

const FreeTrailBanner = ({ user }) => {
  return (
    <>
      {user?.trialExpiresAt &&
        user?.isPaid === false &&
        new Date(user.trialExpiresAt) >= new Date() && (
          <Banner
            massage="תקופת ניסיון חינמית מסתיימת בתאריך : "
            buttonTitle="לרכישת מנוי"
            freeTrailDate={user?.trialExpiresAt}
            colors="bg-gradient-to-r from-[#bd6087] to-[#9089fc] opacity-30"
          />
        )}
      {new Date(user?.trialExpiresAt) < new Date() &&
        user?.isPaid === false && (
          <Banner
            massage="התפריט מוסתר מהלקחות, עליך לחדש את המנוי"
            buttonTitle="לרכישת מנוי"
            freeTrailDate=""
            colors="bg-gradient-to-r from-[#800000] to-[#800000] opacity-80"
          />
        )}
    </>
  );
};

FreeTrailBanner.propTypes = {
  user: PropTypes.shape({
    trialExpiresAt: PropTypes.string,
    isPaid: PropTypes.bool,
  }),
};

export default FreeTrailBanner;
