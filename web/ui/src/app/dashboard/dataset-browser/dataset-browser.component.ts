/*
 * Copyright 2017 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, OnInit} from "@angular/core";
import {FormControl} from '@angular/forms';
import {DatasetBrowserService} from "./dataset-browser.service";
import {IPersistedDatasetDescriptor} from "../../../generated-ts/lineage-model";
import {SearchRequest} from "./dataset-browser.model";
import {BehaviorSubject, identity, timer} from "rxjs";
import {ScrollEvent} from "ngx-scroll-event";
import {debounce, distinct, filter} from "rxjs/operators";

@Component({
    selector: "dataset-browser",
    templateUrl: "dataset-browser.component.html",
    styleUrls: ["dataset-browser.component.less"]
})
export class DatasetBrowserComponent implements OnInit {

    descriptors: IPersistedDatasetDescriptor[]

    searchText = new FormControl()

    private searchRequest$ = new BehaviorSubject<SearchRequest>(null)

    constructor(private dsBrowserService: DatasetBrowserService) {
    }

    ngOnInit(): void {
        this.searchText.valueChanges
            .pipe(debounce(v => timer(v ? 300 : 0)))
            .forEach(this.newSearch.bind(this))

        this.searchRequest$
            .pipe(
                distinct(),
                filter(<any>identity))
            .subscribe((sr:SearchRequest) =>
                this.dsBrowserService
                    .getLineageDescriptors(sr)
                    .then(descriptors => {
                        if (sr == this.searchRequest$.getValue()) {
                            if (sr.offset == 0 ){
                                this.descriptors = descriptors
                            } else {
                                this.descriptors.push(...descriptors)
                            }
                        }
                    }))

        // set initial values
        this.searchText.setValue("")
    }

    newSearch(text: string) {
        this.searchRequest$.next(new SearchRequest(text))
    }

    onScroll(e: ScrollEvent) {
        if (!e.isWindowEvent && e.isReachingBottom)
            this.searchRequest$.next(
                this.searchRequest$.getValue().withOffset(this.descriptors.length))
    }
}