package tidux.app.Notifications;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import tidux.app.MainActivity;
import tidux.app.R;


    public class MyFirebaseMessaging extends FirebaseMessagingService {

        @Override
        public void onNewToken(@NonNull String s) {
            super.onNewToken(s);
            Log.d("TAG1", "token" + s);
        }

        @Override
        public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
            super.onMessageReceived(remoteMessage);
            String title = remoteMessage.getData().get("title");
            String msg = remoteMessage.getData().get("body");
            String orderId = remoteMessage.getData().get("orderId");

            sendNotification(title, msg, orderId);
        }

        private void sendNotification(String title, String msg, String orderId) {
            Intent intent = new Intent(this, MainActivity.class);
            intent.putExtra("orderId", orderId);
            Log.d("TAG1", orderId);
            PendingIntent pendingIntent = PendingIntent.getActivity(this, MyNotification.NOTIFICATION_ID, intent, PendingIntent.FLAG_ONE_SHOT);

            MyNotification notification = new MyNotification(this, MyNotification.CHANNEL_ID_NOTIFICATIONS);
            notification.build(R.mipmap.ic_launcher, title, msg, pendingIntent);
            notification.addChannel("Notificaciones", NotificationManager.IMPORTANCE_DEFAULT);
            notification.createChannelGroup(MyNotification.CHANNEL_GROUP_GENERAL, R.string.notificationChannel);
            notification.show(MyNotification.NOTIFICATION_ID);
        }

    }

