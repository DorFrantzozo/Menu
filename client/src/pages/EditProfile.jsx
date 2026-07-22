import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";

import axiosInstance from "@/utils/baseUrl";
import { updateUser } from "@/state/user/userSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

export default function EditProfile() {
  const [img, setImg] = useState(null); // הלינק לתצוגה המקדימה
  const [imgFile, setImgFile] = useState(null); // הקובץ האמיתי שיישלח לשרת!
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file); // שומרים את הקובץ הפיזי לשליחה לשרת
      setImg(URL.createObjectURL(file)); // שומרים לינק רק בשביל להציג למשתמש
    }
  };

  const removeImage = () => {
    setImg(null);
    setImgFile(null); // מוחקים גם את הקובץ הפיזי
  };

  const handleRestaurantNameChange = (e) => {
    const value = e.target.value;
    const englishOnly = value.replace(/[^A-Za-z\s]/g, "");
    setRestaurantName(englishOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    
    // מוסיף רק את השדות שהמשתמש שינה
    if (restaurantName !== user?.restaurantName) formData.append("restaurantName", restaurantName);
    
    // שינוי קריטי: שולחים את הקובץ (imgFile) ולא את הלינק הוירטואלי (img)
    if (imgFile) formData.append("logo", imgFile); 
    
    if (email !== user?.email) formData.append("email", email);
    if (phone !== user?.phone) formData.append("phone", phone);
    if (password) formData.append("password", password);
    if (displayName !== user?.displayName) formData.append("displayName", displayName);
    if (menuDescription !== user?.menuDescription) formData.append("menuDescription", menuDescription);

    try {
      const response = await axiosInstance.put(
        `/user/updateUser/${user?._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" , Authorization: `Bearer ${token}`,} }
      );

      if (response.status === 200) {
        dispatch(updateUser(response.data.user));
        toast.success("הפרופיל עודכן בהצלחה!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("שגיאה בעדכון הפרופיל. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {isLoading && (
        <div className="absolute inset-0 ">
          <Spinner />
        </div>
      )}
      <h1 className="text-2xl font-semibold mb-4 text-center">עריכת פרופיל</h1>

      <Card className="shadow-sm rounded-2xl">
        <CardContent className="space-y-4 p-6">
          {/* תמונת פרופיל */}
          <div className="flex flex-col items-center space-y-2">
            {user.logo || img ? (
              <img
                src={img || user?.logo}
                alt="תצוגת פרופיל"
                className="w-24 h-24 bg-gray-300 p-2 rounded-full object-cover shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                אין תמונה
              </div>
            )}
            <div className="flex space-x-2 items-center gap-6">
              <Label className="cursor-pointer">
                <span className="text-blue-600">העלאה</span>
                <Input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </Label>
              {img && (
                <Button
                  variant="ghost"
                  onClick={removeImage}
                  className="text-red-500 p-0"
                >
                  הסר
                </Button>
              )}
            </div>
          </div>

          {/* שם מסעדה (אנגלית בלבד) */}
          <div>
            <Label>שם מסעדה (אנגלית בלבד)</Label>
            <Input
              value={restaurantName}
              onChange={handleRestaurantNameChange}
              placeholder={user?.restaurantName || "למשל: MyRestaurant"}
            />
          </div>

          {/* שם להצגה */}
          <div>
            <Label>שם להצגה</Label>
            <Input
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={user?.displayName || "למשל: המסעדה של דוד"}
            />
          </div>

          {/* תיאור תפריט / הכרזות */}
          <div>
            <Label>תיאור תפריט / הכרזות</Label>
            <Input
              onChange={(e) => setMenuDescription(e.target.value)}
              placeholder={user?.menuDescription || "למשל: Happy Hour בכל יום בין 17:00 ל-20:00"}
            />
          </div>

          {/* אימייל */}
          <div>
            <Label>אימייל</Label>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={user?.email || "example@email.com"}
            />
          </div>

          {/* טלפון */}
          <div>
            <Label>טלפון</Label>
            <Input
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder={user?.phone || "050-1234567"}
            />
          </div>

          {/* סיסמה */}
          <div>
            <Label>סיסמה</Label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>

          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-4 rounded-xl"
          >
            שמירה
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}