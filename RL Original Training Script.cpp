/*
Name: Jorge Perez
School: Hunter College
Course: CSCI 49900 (Advanced Applications: A capstone for Majors)

Project: Reinforcement Learning maze that trains an agent (mouse) to find the cheese in a 10x10 maze.

*/

#include <iostream>
#include <array>
#include <vector>
#include <set>
#include <algorithm>
#include <limits>

using namespace std;

class Agent
{
public:



    //ALL UNALLOWED ACTIONS THAT LEAD THE AGENT OUTSIDE THE MAZE ARE SET TO INT_MIN
    Agent() : agent_position(make_pair(0,3)) {
        

        //SETS ALL THE UNALLOWED ACTIONS TO INT_MIN (ACTIONS THAT WILL LEAD THE AGENT TO MOVE OUTSIDE THE MATRIX)
        for (int row = 0; row < maze_size; row++) {
            for (int col = 0; col < maze_size; col++) {
                
                if (row == 0) {
                    q_table[row][col][0] = INT_MIN;
                }

                if (col == 0) {
                    q_table[row][col][2] = INT_MIN;
                }

                if (row == maze_size-1) {
                    q_table[row][col][1] = INT_MIN;
                }

                if (col == maze_size-1) {
                    q_table[row][col][3] = INT_MIN;
                }
            }
        }               
    }


    Agent(int episodes, int step, int epsilon) : total_episodes(episodes), steps(step), epsilon(epsilon) {

        //SETS ALL THE UNALLOWED ACTIONS TO INT_MIN (ACTIONS THAT WILL LEAD THE AGENT TO MOVE OUTSIDE THE MATRIX)
        for (int row = 0; row < maze_size; row++) {
            for (int col = 0; col < maze_size; col++) {

                if (row == 0) {
                    q_table[row][col][0] = INT_MIN;
                }

                if (col == 0) {
                    q_table[row][col][2] = INT_MIN;
                }

                if (row == maze_size - 1) {
                    q_table[row][col][1] = INT_MIN;
                }

                if (col == maze_size - 1) {
                    q_table[row][col][3] = INT_MIN;
                }
            }
        }
    }


    /*
    SELECTS THE NEXT ACTION FOR THE AGENT TO TAKE
    A RANDOM ACTION IS CHOSEN OR AN ACTION WITH THE HIGHEST FUTURE REWARD WILL BE CHOSEN
    */
    int get_action(pair<int,int> position) {
        //EPSILON
        int eps = epsilon;

        
        int action;
        int number = rand() % 100;

        if (number < epsilon) {
            bool valid_action{ false };
            while (!valid_action) {
                action = rand() % 4;

                //MAKES SURE ACTION IS ALLOWED
                if (q_table[position.first][position.second][action] != INT_MIN) {
                    valid_action = true;
                }
            }
        }
        else {
            //RETURNS ALL ACTIONS WITH THE SAME MAX VALUE 
            vector<int> actions = get_all_max_actions(position);
            number = rand() % actions.size();
            action = actions[number];
        }

        return action;
    }




    //FINDS THE MAX Q VALUE IN THE Q TABLE FOR THE CURRENT AGENT'S POSITION
    //RETURNS THE INDEX/ACTION AND THE MAX VALUE
    //RETURNS THE ACTION/INDEX OF THE MAX Q VALUE AND THE ACTUAL MAX Q VALUE IN A PAIR TUPLE
    pair<int, int> find_max_qvalue(pair<int, int> position) {
        int min = INT_MIN;
        int action;
        for (int value = 0; value < 4; value++) {
            if (q_table[position.first][position.second][value] > min) {
                min = q_table[position.first][position.second][value];
                action = value;
            }
        }

        //(ACTION, VALUE)
        return {action, min};
    }

  




    /*
        INPUT: ACTION NUMBERS (0,1,2,3)
        OUTPUT: THE NEW POSITION OF THE AGENT AFTER 'PEFORMING' THE 'ACTION'
    */
    pair<int, int> take_action(pair<int,int> position, int action) {
        pair<int, int> new_state(make_pair(0, 0));

        //UP
        if (action == 0) {
            new_state.first = position.first - 1;
            new_state.second = position.second;
        }

        //DOWN
        else if (action == 1) {
            new_state.first = position.first + 1;
            new_state.second = position.second;
        }

        //LEFT
        else if (action == 2) {
            new_state.second = position.second - 1;
            new_state.first = position.first;
        }

        //RIGHT
        else if (action == 3) {
            new_state.second = position.second + 1;
            new_state.first = position.first;
        }

        return new_state;     
    }

    


    //N-STEP
    int n_step(pair<int,int> position, int step) {

        int max = INT_MIN;
        if (step == steps || (position.first == maze_size-1 && position.second == maze_size-1) ) {

            return find_max_qvalue(position).second;
        }
        
        else {
            step++;
           
            //GET ALL VALID ACTIONS AT "POSITION"
            vector<int> valid_actions = get_valid_actions(position);

           
            int reward_ = 0;
            int q_value = 0;
            int max_action = 0;

            //ITERATE THROUGH EACH ACTION
            //SEARCH FOR THE MAX REWARD + MAX Q VALUE AT THE SECOND STEP
            for (int action = 0; action < valid_actions.size(); action++) {
                int current_action = valid_actions[action];
                int reward = 0;
                int future_value = 0;
                int value = 0;


                //TAKE ACTION
                pair<int, int> next_position = take_action(position, current_action);
               
                //GET REWARD
                reward = matrix[next_position.first][next_position.second];
               
               
                value = n_step(next_position, step);
                future_value = reward + value;
                
                //MAX = 
                if (future_value > max) {
                    max_action = current_action;
                    reward_ = reward;
                    q_value = value;
                    max = future_value;
                }
                

            }
            int current_value = q_table[position.first][position.second][max_action];

            q_table[position.first][position.second][max_action] = current_value + (reward_ + (q_value) - (current_value));
        }

        return max;


    }
    




    //COPY CURRENT Q_TABLE TO ANOTHER DUMMY Q_TABLE (previous_table)
    void copy_table() {
        for (int row = 0; row < maze_size; row++) {
            for (int col = 0; col < maze_size; col++) {
                for (int value = 0; value < 4; value++) {
                    previous_table[row][col][value] = q_table[row][col][value];
                }
               
            }
        }
    }

    //CHECKS IF PREVIOUS TABLE IS EQUAL TO THE NEW UPDATED Q_TABLE
    //Returns true if both tables are equal, returns false otherwise
    bool check_convergence() {
        for (int row = 0; row < maze_size; row++) {
            for (int col = 0; col < maze_size; col++) {
                for (int value = 0; value < 4; value++) {
                    if (previous_table[row][col][value] != q_table[row][col][value] && matrix[row][col] != -500) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

  

    //AGENT WILL SEARCH FOR THE OPTIMAL PATH TO THE GOAL AS IT UPDATES THE Q-TABLE
    void start_training() {
        cout << "TRAINING AGENT..." << endl;
        srand(unsigned int(time(NULL)));

        int episodes = 0;

        //KEEP TRACK OF THE AMOUNT OF TIMES THE Q-TABLE HAS STAYED THE SAME OVER EACH EPISODE
        int equal_tables = 0;

        //TRAIN THE AGENT TO FIND THE FINAL STATE
        while (episodes < total_episodes) {
            //cout << "EPISODE: " << episodes + 1 << endl << endl;

            //COPY Q_TABLE BEFORE THE EPISODE BEGINS AND UPDATES ARE MADE TO THE TABLE, USED TO COMPARE NEW UPDATED Q_TABLE TO THE PREVIOUS TABLE AT THE PREVIOUS EPISODE
            copy_table();

            bool final_state{false};

            //START POSITION
            pair<int, int> start_position = make_pair(0, 0);
            agent_position = start_position;

            //AGENTS MOVES POSITIONS UNTIL IT REACHES ITS GOAL
            while (final_state == false) {
                //STORE NEW STATE
                pair<int, int> new_position;

                int action;
                int current_value;
                int reward = 0;

                //LEARNING FACTOR AND DISCOUNT FACTOR SET TO 1
                int d_factor = 1;
                int l_factor = 1;

                //Get action
                action = get_action(agent_position);
                //Take the action, get the new position of the agent
                new_position = take_action(agent_position, action);

                current_value = q_table[agent_position.first][agent_position.second][action];

                //GET REWARD FROM MATRIX
                reward = matrix[new_position.first][new_position.second];


                //N-STEP
                int max_value = n_step(new_position,1);

                //UPDATE Q_VALUE
                q_table[agent_position.first][agent_position.second][action] = current_value + l_factor * (reward + (d_factor * max_value) - current_value);



                //move the agent
                agent_position = new_position;
              
                //If the agent reaches the goal state in the maze then the episode will end and a new episode will start
                if (agent_position.first == maze_size-1 && agent_position.second == maze_size-1) {
                    final_state = true;
                    
                }
                
            }//SINGLE EPISODE

            //Keep track of the amount of episodes where there are no changes in values in the q-table
            if (check_convergence() == true) {
                equal_tables++;     
               
            }
            else {
                //RESETS COUNTER
                equal_tables = 0;
            }

            episodes++;
            //cout << "Episode:" << episodes << endl;
           
        }//EPISODES WHILE LOOP
       
    }//TRAINING FUNCTION



    //DEBUG FUNCTION
    void print_qtable() {

        for (int row = 0; row < maze_size; row++) {
            for (int col = 0; col < maze_size; col++) {
                cout << " STATE : (" << row << "," << col << ") = ";
                for (int value = 0; value < 4; value++) {
                    cout << q_table[row][col][value] << " ";
                }
                cout << endl;
            }
        }
        cout << endl;
    }
   

    //RETUNRS A VECTOR WITH ALL VALID ACTIONS THE AGENT CAN TAKE AT CURRENT 'POSITION'
    vector<int> get_valid_actions(pair<int, int> position) {

        vector<int> valid_actions;
       
        for (int index = 0; index < 4; index++) {
            if (q_table[position.first][position.second][index] != INT_MIN) {
                valid_actions.push_back(index);
            }
        }
     

        return valid_actions;

    }


    //RETURNS VECTOR WITH ALL ACTIONS THAT HAVE THE SAME MAX VALUE AT CURRENT 'POSITION'
    vector<int> get_all_max_actions(pair<int, int> position) {
        
        vector<int> actions_with_maxvalue;
        int min = INT_MIN;
        int action;
        for (int index = 0; index < 4; index++) {
            if (q_table[position.first][position.second][index] > min) {
                min = q_table[position.first][position.second][index];
                action = index;
            }
        }
        actions_with_maxvalue.push_back(action);

        for (int value = action+1; value < 4; value++) {
            if (q_table[position.first][position.second][value] == min) {
                actions_with_maxvalue.push_back(value);
            }
        }

        return actions_with_maxvalue;
        
    }
   



    //SHOWCASE THE OPTIMAL PATH AFTER TRAINING IS DONE 
    void optimal_path(int x, int y) {

        cout << "SINGLE OPTIMAL PATH AT STARTING POSITION (" << x << "," << y << "):" << endl << endl;
        pair<int, int> start{ make_pair(x,y) };
        pair<int, int> next;


        agent_position = start;
        bool found_cheese{ false };
        while (found_cheese == false) {
            int action;

            action = find_max_qvalue(agent_position).first;
            if (action == 0) {
                cout << "UP, ";

            }
            else if (action == 1) {
                cout << "DOWN, ";
            }
            else if (action == 2) {
                cout << "LEFT, ";
            }
            else if (action == 3) {
                cout << "RIGHT, ";
            }

            next = take_action(agent_position,action); 


            agent_position = next;
            if (agent_position.first == maze_size-1 && agent_position.second == maze_size-1) {
                found_cheese = true;
            }
        }
        cout << endl << endl << endl;
        
    }

  
 

    
    //2D MATRIX WITH REWARDS AS VALUES(10X10 MATRIX)
    //  -1  = OPEN/FREE SPACE
    // -500 = TRAP
    //  100 = CHEESE (GOAL)
    int matrix[10][10] = 
    {
        {  -1, -500, -500, -500, -500, -500,   -1,   -1,   -1,   -1},         
        {  -1,   -1,   -1,   -1,   -1, -500,   -1, -500,   -1,   -1}, 
        {  -1,   -1,   -1,   -1,   -1, -500,   -1,   -1,   -1,   -1},
        {  -1, -500,   -1,   -1,   -1, -500,   -1,   -1, -500,   -1},
        {  -1, -500,   -1,   -1,   -1, -500,   -1, -500,   -1,   -1},
        {  -1, -500,   -1,   -1,   -1, -500,   -1, -500,   -1, -500},
        {  -1, -500,   -1,   -1,   -1, -500,   -1, -500,   -1, -500},
        {  -1, -500,   -1,   -1, -500, -500,   -1, -500,   -1,   -1},
        {-500,   -1,   -1,   -1,   -1,   -1,   -1, -500,   -1,   -1},
        {  -1,   -1,   -1,   -1, -500, -500, -500, -500,   -1,  100}
    
    
    };

    int maze_size = 10;
    
    
    
    //3D MATRIX FOR Q-TABLE
    //X AND Y = 4X4 MATRIX
    //Z = ACTIONS, (0 = UP, 1 = DOWN, 2 = LEFT, 3 = RIGHT)
    //INITIAL VALUES SET TO 0 
    int q_table[10][10][4] = { 0 };
    int previous_table[10][10][4] = { 0 };

    int q_table_one[10][10][4] = { 0 };
    int previous_table_one[10][10][4] = { 0 };
    
   

    int total_episodes;
    int steps;
    int epsilon;
    
    pair<int, int> agent_position;

  
};




int main()
{
    int episodes = 100000;
    
    //2ND PARAMETER = AMOUNT OF STEPS
    //3RD PARAMETER = EPSILON
    Agent mouse_one_step(episodes,1,25);
    Agent mouse_two_steps(episodes,2,25);
   

    cout << "ONE STEP AGENT: " << endl;
    mouse_one_step.start_training();
    //mouse_one_step.print_qtable();
    cout << "TRAINING COMPLETE" << endl;
    cout << endl;

    cout << "TWO STEP AGENT: " << endl;
    mouse_two_steps.start_training();
    //mouse_two_steps.print_qtable();
    cout << "TRAINING COMPLETE" << endl;
    cout << endl;


    
    bool equal = true;
    for (int row = 0; row < 4; row++) {
        for (int col = 0; col < 4; col++) {
            for (int value = 0; value < 4; value++) {
                if (mouse_one_step.q_table[row][col][value] != mouse_two_steps.q_table[row][col][value]) {
                    equal = false;
                }
            }
            
        }
    }
    cout << endl;
  
    int x, y;

    while (true) {
        cout << "Enter starting position: ";
        cin >> x >> y;
        cout << "ONE STEP AGENT: " << endl;
        mouse_one_step.optimal_path(x, y);
        cout << "TWO STEP AGENT: " << endl;
        mouse_two_steps.optimal_path(x, y);
        cout << endl;
    }
   

   

    system("pause>0");

}




