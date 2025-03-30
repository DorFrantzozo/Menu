import Banner from "../banner/Banner";

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
          />
        )}
    </>
  );
};

export default FreeTrailBanner;
