package com.example.aj.lets;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.view.View;

import com.firebase.client.AuthData;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;
//import com.facebook.FacebookSdk;


public class eventList extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_list);
    }
    TextView TextViewTitle= (TextView) findViewById(R.id.textViewTitle);
    Button b= (Button) findViewById(R.id.buttonActivityEat);
    Button buttonActivityFeds= (Button) findViewById(R.id.buttonActivityFeds);
    Button buttonActivityMeet= (Button) findViewById(R.id.buttonActivityMeet);
    Button buttonActivityPlay= (Button) findViewById(R.id.buttonActivityPlay);
    Button buttonActivityStudy= (Button) findViewById(R.id.buttonActivityStudy);



}
