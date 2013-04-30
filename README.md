reflections<sup>2</sup>projections
===================

Class: CS 467

Team: Ciara Proctor, Cole Gleason, Adam Yala

The Data
========
We have hand-compiled a list of speakers and talks from the Reflections | Projections conference
throughout the years. The types of data collected is below:

Speakers:
* Name
* Highest Degree at time of talk
* Place that degree was earned
* Gender
* Affiliated Organization at time of talk
* Talk Subject (hand coded)
* Talk Title
* Talk Abstract

If we could not find the data, that field was left blank.

We then created a JSON file from our data, structured as follows:

<pre>
{
    "speaker_years": {
        "Adrian Bowyer": [
            2006
        ], 
        "Jeffrey Altman": [
            2006
        ], 
        "Kwabena Boahen": [
            2006
        ]
    }, 
    "years": {
        "2006": {
            "attendees": 0, 
            "events": [
                {
                    "abstract": "In this talk I will share my life experience, my motivations, my dreams, successes and failures. It is my hope that those who attend will be inspired not only to follow a career in computer science but to do so while thinking outside the box and applying their skills to solving society's challenges. Computers are tools to be used solve much more interesting and complex problems in life. Computer science is one of the greatest fields to choose as a career because your skills can be applied to just about any problem domain from education to genetic sequencing to space exploration to modern dance to health care. A successful career requires the understanding not only of computer science techniques but also the problem domain to which they are applied. It is this application of computer science which in my opinion makes being a computer scientist or engineer the greatest occupation the world has ever known.", 
                    "speakers": [
                        "Jeffrey Altman"
                    ], 
                    "title": "Making A Difference in Society With A Career in Computer Science", 
                    "topic": [
                        "Impact"
                    ]
                }, 
                {
                    "abstract": "Nanoelectronic technology promises to cram a trillion transistors onto a 1cm2 chip. How do we harness all these devices? Abstraction, which has been used until now, is becoming increasingly inadequate as microelectronic chips approach a billion transistors. We can learn from biology, which handles complexity through developmental processes that elaborate a relatively simple starting recipe into a complex mature structure. By borrowing from biology, we have developed two self-configuring microelectronic chips. These chips capture the ability of epigenetic development to generate representations of features in neural layers and to autoroute connections between these layers. This metamorphic approach provides a powerful alternative to handling complexity in nanoelectronic systems.", 
                    "speakers": [
                        "Kwabena Boahen"
                    ], 
                    "title": "Metaelectronics: Self-Configuring Neuromorphic Systems", 
                    "topic": [
                        "Embedded Systems"
                    ]
                }, 
                {
                    "abstract": "This talk will be about RepRap\u2014the replicating rapid prototyper. RepRap will be a desktop manufacturing system that is able to make the vast majority of its own component parts, so\u2014if your friend has a RepRap machine\u2014you can ask him or her to make you the parts for one too. RepRap will be open-source, and will be distributed under the GNU General Public Licence; so anyone can have one.  Once you have a RepRap, you will be able to download designs for a wide range of items\u2014from coat-hooks to cameras\u2014and have your RepRap machine make them. In doing this, you will have used no goods transport, exchanged no money, and avoided completely any industrial involvement. You will also be able to design and to make items yourself, and\u2014optionally\u2014to post those designs online under the GPL for the benefit of others. RepRap has the potential to completely revolutionise manufacturing and wealth-creation for the entire world.", 
                    "speakers": [
                        "Adrian Bowyer"
                    ], 
                    "title": "The Replicating Rapid-prototyper\u2014Moving Hardware Through the Wires", 
                    "topic": [
                        "Prototyping"
                    ]
                }
            ], 
            "speakers": [
                {
                    "affiliation": "Secure Endpoints", 
                    "degree": null, 
                    "degree_from": null, 
                    "name": "Jeffrey Altman", 
                    "sex": "M", 
                    "talks": [
                        "Making A Difference in Society With A Career in Computer Science"
                    ]
                }, 
                {
                    "affiliation": "Stanford University", 
                    "degree": "PhD", 
                    "degree_from": "California Institute of Technology", 
                    "name": "Kwabena Boahen", 
                    "sex": "M", 
                    "talks": [
                        "Metaelectronics: Self-Configuring Neuromorphic Systems"
                    ]
                }, 
                {
                    "affiliation": "Bath University", 
                    "degree": "PhD", 
                    "degree_from": "Imperial College", 
                    "name": "Adrian Bowyer", 
                    "sex": "M", 
                    "talks": [
                        "The Replicating Rapid-prototyper\u2014Moving Hardware Through the Wires"
                    ]
                }
            ]
        }
    }
}
</pre>

Running
=======
Start a webserver in the project root and load index.html.

<pre>python -m SimpleHTTPServer 8000</pre>
   
Use the years in the sidebar to see a specific year.  Logo takes you back to overview.  Clicking most elements in charts or lists will pull up a list of speakers/events in the right column.
