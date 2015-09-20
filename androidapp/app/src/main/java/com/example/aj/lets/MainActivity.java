package com.example.aj.lets;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import com.firebase.client.AuthData;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;
//import com.facebook.FacebookSdk;
import android.view.Menu;
import android.view.MenuItem;

public class MainActivity extends Activity {
    private Firebase backend;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Firebase.setAndroidContext(this);
    }

    @Override
    protected void onStart() {
        super.onStart();

        backend = new Firebase("https://incandescent-torch-8518.firebaseio.com");
        TextView TextViewEnterMessage= (TextView) findViewById(R.id.TextViewEnterMessage);
        Button ButtonSignInFb= (Button) findViewById(R.id.ButtonSignInFb);
    }

    public void signIn(){

        Intent startEventsList= new Intent(this, test.class);
        startActivity(startEventsList);

    }





    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }


}


