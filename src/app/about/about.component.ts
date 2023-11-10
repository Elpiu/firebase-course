import {Component, OnInit} from '@angular/core';


import 'firebase/firestore';

import {AngularFirestore} from '@angular/fire/firestore';
import {COURSES, findLessonsForCourse} from './db-data';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  constructor(private db: AngularFirestore) {
  }

  async uploadData() {
    const coursesCollection = this.db.collection('courses');
    const courses = await this.db.collection('courses').get();
    for (let course of Object.values(COURSES)) {
      const newCourse = this.removeId(course);
      const courseRef = await coursesCollection.add(newCourse);
      const lessons = await courseRef.collection('lessons');
      const courseLessons = findLessonsForCourse(course['id']);
      console.log(`Uploading course ${course['description']}`);
      for (const lesson of courseLessons) {
        const newLesson = this.removeId(lesson);
        delete newLesson.courseId;
        await lessons.add(newLesson);
      }
    }
  }

  removeId(data: any) {
    const newData: any = {...data};
    delete newData.id;
    return newData;
  }


  onReadDoc() {
    this.db.doc("/courses/0P5gr8aAHh6Moy2Qgg6i")
        .get()
        .subscribe(
            snap => {
              console.log(snap.id)
              console.log(snap.data())
            }
        )
  }

  onReadDocSnapChanges() {
    this.db.doc("/courses/0P5gr8aAHh6Moy2Qgg6i")
        //.snapshotChanges()
        .valueChanges()
        .subscribe(
            snap => {
              //console.log(snap.payload.id)
              //console.log(snap.payload.data())
              console.log(snap)
            }
        )
  }

  onReadCollection() {
    this.db.collection(
        '/courses/1HFdAEco3ySegWGqshBJ/lessons',
        ref => ref.where('seqNo', '<=', 8)
            .orderBy('seqNo')
    )
        .get()
        .subscribe(
            snaps => {
              snaps.forEach(snap => {
                console.log(snap.id)
                console.log(snap.data())
              })
            }
        )
  }

  onReadCollectionPerformance() {
    this.db.collection(
        '/courses',
        ref => ref.where('seqNo', '<=', 38)
            .where("url", "==", "angular-material-course")
            .orderBy('seqNo')
    )
        .get()
        .subscribe(
            snaps => {
              snaps.forEach(snap => {
                console.log(snap.id)
                console.log(snap.data())
              })
            }
        )
  }

  onReadCollectionGroup() {
    this.db.collectionGroup('lessons',
        ref => 
          ref.where('seqNo', '==', 1))
              .get()
        .subscribe(
            snaps => {
              snaps.forEach(snap => {
                console.log(snap.id)
                console.log(snap.data())
              })
            }
        )

  }
}
















