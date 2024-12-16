import { getNotifications } from "../service/api";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

const useNavBar = () => {

    const { pathname } = useLocation()
    const token = localStorage.getItem('token_app_wpl')
    const token_flag = token ? true : false;
    

    const {data: notificationCount} = useQuery({
        queryKey: ['notificationsDetails'],
        queryFn: () => handleGetNotifications(),
        refetchInterval: 3000,
        enabled: pathname !== '/onboarding' && pathname !== '/forgetpassword' && token_flag,
        initialData: 0
    })

    const handleGetNotifications = async () => {
        const resp = await getNotifications();
        const notis = resp.data
          .filter((notification) => !notification.isRead && !notification.isHidden ) // Filter out hidden and red notifications
        return notis.length;
    }

    return {
        notificationCount,
        handleGetNotifications
    }
}

export default useNavBar;